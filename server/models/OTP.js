const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mailTemplate/emailVerificationTemplate");

const OtpSchema =new  mongoose.Schema({
       email:{
              type:String,
              required:true,
       },
       otp:{
              type:String,
              required:true,
       },
       createdAt:{
              type:Date,
              default:Date.now(),
              expires:60*5, 
       }
});
const sendVerificationMail= async(email,otp)=>{
       try{
              const mailResponse = await mailSender(
                     email,
                     "Verififcation Email",
                     otpTemplate(otp)
              );
              console.log("mail of otp is sent succesfully",mailResponse);
       }catch(error){
              console.log("error occured while sending mail",error)
              throw error;
       }

       
}

OtpSchema.pre("save", async(next)=>{
       if(this.isNew)
       {
          await sendVerificationMail();    
       }
       next();

})

module.exports= mongoose.model("OTP", OtpSchema)