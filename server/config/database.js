const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL= process.env.DB_URL;

const dbConnect = ()=>{
    mongoose.connect(DB_URL)
    .then(()=>{
        console.log("Database is connected succesfully with app");
    })
    .catch((error)=>{
        console.log("Error during database connection:",error);
        process.exit(1);
    })
}

module.exports=dbConnect;
