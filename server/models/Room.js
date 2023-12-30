const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:true,
    },
    problem:{
        type:String,
    },
    code:{
        type:String,
    },
    clients: [{ socketId: String, username: String }],
    chatMessages: [{ username: String, message: String, timestamp:{ type: Date, default: Date.now } }],
  });


  module.exports = mongoose.model("Room",roomSchema);
