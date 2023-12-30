const crypto = require("crypto");
const bcrypt =  require("bcryptjs")
const Users = require("../models/Users");
const { findOneAndUpdate } = require("../models/Profile");
const mailSender = require("../utils/mailSender");

exports.resetPasswordToken = async (req,res)=>{
    try{
        const {email}=req.body;

    const user = await Users.findOne({email});
    if(!user)
    {
        return res.status(404).json({
            success:falsee,
            message:"Email is not registrede with us, enter a valid email",
        });
    }
    const token= crypto.randomBytes(20).toString("hex");

    const updatedUser = await findOneAndUpdate(
        {email:email},
        {
            token:token,
           resetPasswordExpires:Date.now() + 360000
        },
        {new:true}
    );

    const url = "http://localhost:5713/update-password/${token}";
    await mailSender(
        email,
        "Password Reset",
        `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )

    return res.status(200).json({
        success:true,
        message:"Email sent successfully, plaese check ypur eamil"
    })

    }catch(error)
    {
        return res.status(404).json({
            success:false,
            message:"error coocurred while sennding the reset mail"
        })

    }
};


exports.resetPassword = async (req, res) => {
    try {
      const { password, confirmPassword, token } = req.body
  
      if (confirmPassword !== password) {
        return res.json({
          success: false,
          message: "Password and Confirm Password Does not Match",
        })
      }
      const userDetails = await Users.findOne({ token: token })
      if (!userDetails) {
        return res.json({
          success: false,
          message: "Token is Invalid",
        })
      }
      if (!(userDetails.resetPasswordExpires > Date.now())) {
        return res.status(403).json({
          success: false,
          message: `Token is Expired, Please Regenerate Your Token`,
        })
      }
      const encryptedPassword = await bcrypt.hash(password, 10)
      await Users.findOneAndUpdate(
        { token: token },
        { password: encryptedPassword },
        { new: true }
      )
      res.json({
        success: true,
        message: `Password Reset Successful`,
      })
    } catch (error) {
      return res.json({
        error: error.message,
        success: false,
        message: `Some Error in Updating the Password`,
      })
    }
  }
  