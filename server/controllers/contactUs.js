

exports.contactUsController = async (req,res)=>{
    const {firstName,lastName,email,message , phoneNo,countryCode} = req.body;

    if(!firstName || !lastName || ! email || !message ||  !phone)
    {
        return res.status().json({
            success:false,
            message:"all field are required",
        }) 
    }
    try{
        const emailRes = await mailSender(
            email,
            "Your Data send successfully",
            contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode)
          )
          console.log("Email Res ", emailRes)
          return res.json({
            success: true,
            message: "Email send successfully",
          })

    }catch(error)
    {
        return res.status().json({
            success:false,
            message:"Some Error occured while sending mail",
            error:error.message,
        })
    }

}