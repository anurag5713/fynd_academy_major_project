exports.contactUsController = async (req, res) => {
    // Destructure data from the request body
    const { firstName, lastName, email, message, phoneNo, countryCode } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !message || !phoneNo) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        // Send email with the provided data
        const emailRes = await mailSender(
            email,
            "Your Data send successfully",
            contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode)
        );
        
        // Log the email response
        console.log("Email Response: ", emailRes);

        // Respond with success message
        return res.json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        // Handle errors during email sending
        return res.status(500).json({
            success: false,
            message: "Some error occurred while sending mail",
            error: error.message,
        });
    }
};
