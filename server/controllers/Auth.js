
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mailTemplate/passwordUpdate");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup controller
exports.signup = async (req, res) => {
    try {
        // Destructure data from the request body
        const { firstName, lastName, email, password, confirmPassword, otp } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm password do not match",
            });
        }

        // Check if the user is already registered
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered, please sign in to continue",
            });
        }

        // Check if the provided OTP is valid
        const otpResponse = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (otpResponse.length === 0 || otp !== otpResponse[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create profile details
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create user
        const user = await Users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            additionalInformation: profileDetails._id,
            image: "",
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again later",
            error: error.message,
        });
    }
};

// Login controller for user authentication
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Find the user by email and populate additionalInformation
        const user = await Users.findOne({ email }).populate("additionalInformation");

        // Check if the user is not found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, sign up to continue",
            });
        }

        // Compare the provided password with the hashed password in the database
        if (await bcrypt.compare(password, user.password)) {
            // Generate JWT token for authentication
            const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            // Attach token to the user object
            user.token = token;
            user.password = undefined;

            // Set options for the cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            // Set the token in the cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                user,
                token,
                message: "User login successful",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Incorrect password, try again",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed, please try again",
            error: error.message,
        });
    }
};

// Send OTP controller
exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email is not provided",
            });
        }

        // Generate a unique OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Check if the generated OTP already exists, generate a new one if needed
        const result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
        }

        // Save the generated OTP in the database
        const otpBody = await OTP.create({
            email,
            otp: otp,
        });

        return res.status(200).json({
            success: true,
            otp,
            message: 'OTP sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Problem occurred while sending OTP",
        });
    }
};

// Change Password controller
exports.changePassword = async (req, res) => {
    try {
        // Get the user based on the ID stored in the JWT token
        const user = await Users.findById(req.user.id);

        // Destructure the data from the request body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Check if the old password is correct
        const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
        if (!checkOldPassword) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Check if the new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            return res.status(404).json({
                success: false,
                message: "New password and confirm new password do not match",
            });
        }

        // Generate a salt and hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        const updatedUser = await Users.findByIdAndUpdate(
            req.user.id,
            { password: hashedPassword },
            { new: true }
        );

        // Send a mail notification after updating the password
        try {
            const mailResponse = await mailSender(
                user.email,
                passwordUpdated(
                    user.email,
                    `Password updated successfully for ${user.firstName} ${user.lastName}`
                )
            );
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending mail",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating the password",
            error: error.message,
        });
    }
};






