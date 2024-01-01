const crypto = require("crypto");
const bcrypt =  require("bcryptjs")
const Users = require("../models/Users");
const { findOneAndUpdate } = require("../models/Profile"); // Note: Check if "findOneAndUpdate" is correct or if it should be "updateOne" or similar
const mailSender = require("../utils/mailSender");

// Controller for sending the reset password token
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered with us, enter a valid email",
            });
        }

        // Generate a random token
        const token = crypto.randomBytes(20).toString("hex");

        // Update user's token and resetPasswordExpires
        const updatedUser = await findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 360000,
            },
            { new: true }
        );

        const url = `https://codemate9.netlify.app/${token}`;
        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this URL to reset your password.`
        );

        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your email",
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Error occurred while sending the reset mail",
        });
    }
};

// Controller for resetting the password
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // Check if password and confirmPassword match
        if (confirmPassword !== password) {
            return res.json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        // Find user details by token
        const userDetails = await Users.findOne({ token: token });

        // Check if user details are found
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid",
            });
        }

        // Check if the token is not expired
        if (!(userDetails.resetPasswordExpires > Date.now())) {
            return res.status(403).json({
                success: false,
                message: "Token is expired, please regenerate your token",
            });
        }

        // Encrypt the new password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        await Users.findOneAndUpdate(
            { token: token },
            { password: encryptedPassword },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: "Some error in updating the password",
        });
    }
};
