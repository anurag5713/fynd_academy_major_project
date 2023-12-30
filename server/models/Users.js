const mongoose = require("mongoose");
const Profile = require("./Profile");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    image:{
        type:String
    },
    additionalInformation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Profile,
        required:true, 
    },
    
},
{timestamps:true});

module.exports = mongoose.model("User", userSchema);
