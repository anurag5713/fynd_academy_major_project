const bcrypt= require("bcryptjs");
const Users = require("../models/Users");
const otpGenerator=require("otp-generator");
const OTP=require("../models/OTP")
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mailTemplate/passwordUpdate");


//signup controller
exports.signup = async(req,res)=>{
    try{
        //destructing the data fron request body
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp
        }=req.body;
        if(! firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                sucess:false,
                message:"All Field are required",
            })
        }
        if(password !== confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password does not match",
            });
        }
        console.log("password is matched");
        //checking if user is already exists
        const existingUser = await Users.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                sucess:false,
                message:"User is already registered , plaese sign in to continue"
            });
        }
    console.log("existing user is checked");
    const otpResponse = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log("otpResponse",otpResponse);
    if(otpResponse.length === 0 )
    {
        return res.status(400).json({
            sucess:false,
            message:"OTP is not valid"
        })
    }
    if(otp !== otpResponse[0].otp)
    {
        return res.status(400).json({
            sucess:false,
            message:"OTP is not valid",
        })
    }
    console.log("otp is verified");

    //hashing the password with help of bcryptjs
    const salt=await bcrypt.genSalt(10);
    let hashedPassword =await bcrypt.hash(password,salt);
    console.log("password is hashed");

    //creating profile details
    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        conatctNumber:null,
    });
    console.log("profile details created");

    //creating user
    const user = await Users.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        additionalInformation:profileDetails._id,
        image:"",

    });
    console.log("user is craeted");
    return res.status(200).json({
        success:true,
        user,
        message:"User registered sucessfully",
        
    });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again later"
        })

    }
};

//login controller for authentiacting user
exports.login=async(req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email || !password)
        {
            return res.status(404).json({
                success:false,
                message:"all fields are required"
            });
        }

        const user = await Users.findOne({email}).populate("additionalInformation");
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"User is not registred , sign up to continue",
            })
        }

        if(await bcrypt.compare(password,user.password))
        {
            const token = jwt.sign(
                {email:user.email , id:user._id},
                process.env.SECRET_KEY,
                {
                    expiresIn:"24h"
                }
            )
            user.token  = token;
            user.password=undefined;
            const options ={
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token ,options).status(200).json({
                success:true,
                user,
                token,
                message:"User login successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect password, try again"
            })
        }
    }catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Login failed, please try again"
        })
    }
};


exports.sendotp=async(req,res)=>{
   try{
    const {email} =req.body;

    if(!email)
    {
        return res.status(404).json({
            success:false,
            meaasge:"email is not provided",
        })
    }

    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })

    const result = await OTP.findOne({otp:otp});
    while(result)
    {
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
    }
    const otpBody = await OTP.create({
        email,
        otp:otp,
    });
    return res.status(200).json({
        success:true,
        otp,
        message:'Otp sent successfully',
    })

   }catch(error)
   {
    return res.status(500).json({
        success:false,
        error:error.message,
        message:"Problem occured while sending otp",
    });
   }
};

exports.changePassword = async(req,res)=>{
    try{
        const user = await Users.findById(req.user.id);

    const {oldPassword , newPassword , confirmNewPasword} = req.body;
    const checkOldPassword = await bcrypt.compare(oldPassword,user.password);
    if(!checkOldPassword)
    {
        return res.status(401).json({
            success:false,
            message:"Old password is incorrect",
        })
    }
    if(newPassword !== confirmNewPasword){
        return res.status(404).json({
            success:false,
            message:"New password and confirm new password does not match"
        })
    }
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(newPassword,salt);

    const updatedUser = await Users.findByIdAndUpdate(
        req.user.id,
        {password:hashedPassword},
        {new:true},
    )
    //sending mail after updating password
    try{
        const mailResponse = await mailSender(
            updatedUser.email,
            passwordUpdated( updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`)
        )
    }catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Error occcurred while sending mail",
            error:error.message,
        })
    }

    return res.status(200).json({
        success:true,
        message:"Password Upadted successfully",
    })

    }catch(error)
    {
        returnres.status(500).json({
            success:false,
            message:"Error occurred while updating the password",
            error:error.message,
        })
    }
};





