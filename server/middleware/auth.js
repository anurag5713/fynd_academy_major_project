const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware for authentication using JWT
exports.auth = async (req, res, next) => {
    try {
        // Extract the token from cookies, request body, or Authorization header
        const { token } = req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer ", "");

        // Check if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {
            // Verify the token using the JWT_SECRET from the environment variables
            const decode = await jwt.verify(token, process.env.JWT_SECRET);

            // Attach the decoded user information to the request object
            req.user = decode;

            // Continue to the next middleware or route handler
            next();
        } catch (error) {
            // Handle token verification failure
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
    } catch (error) {
        // Handle any other errors that might occur during the authentication process
        return res.status(401).json({
            success: false,
            message: "Problem occurred while validating token",
            error: error.message,
        });
    }
};
