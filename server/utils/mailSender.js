const nodemailer=require("nodemailer");

const mailSender = async(email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            },
            secure:false,
        });
        let info = transporter.sendMail({
            from:` "CodeMate || Collabrative Coding made Easy" <${process.env.MAIL_USER}>`,
            to:email,
            subject:title,
            html:body,
        });
        return info;
    }catch(error)
    {
        console.log("error while sending mail:",error);
        return error.message

    }
}
module.exports=mailSender;
