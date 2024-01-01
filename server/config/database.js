const mongoose = require("mongoose");
require("dotenv").config();

// Retrieve the MongoDB database URL from the environment variables
const DB_URL = process.env.DB_URL;

// Define the function to connect to the database
const dbConnect = () => {
    // Connect to the MongoDB database using Mongoose
    mongoose.connect(DB_URL)
        .then(() => {
            console.log("Database is connected successfully with the app");
        })
        .catch((error) => {
            console.log("Error during database connection:", error);
            process.exit(1); // Exit the process with an error code if the connection fails
        });
};

// Export the dbConnect function to make it available for use in other parts of the application
module.exports = dbConnect;
