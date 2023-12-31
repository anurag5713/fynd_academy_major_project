const jwt=require("jsonwebtoken")
require("dotenv").config();

exports.auth = async(req,res,next)=>{
    try{
        const {token} = req.cookies.token ||
         req.body.token || 
         req.header("Authorization").repalce("Bearer ","");

         if(!token)
         {
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
         }

         try{
            const decode = await jwt.sign(token , process.env.JWT_SECRET);
            req.user = decode;

         }catch(error)
         {
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
         }
         next();

    }catch(error)
    {
        return res.status(401).json({
            success:false,
            message:"problem occcured while validting token",
            error:error.message,
        })
    }
}