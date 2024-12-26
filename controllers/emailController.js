const sendEmail = require("../utils/sendEmail");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

exports.sendCustomEmail = asyncErrorHandler(async (req, res, next) => {
  const { email, subject, message } = req.body;

  // Validate required fields
  if (!email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Email, subject, and message are required fields.",
    });
  }

  try {
    // Create formatted email content
    const formattedMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="text-align: center; color: #4CAF50;">New Contact Form Submission</h2>
        <p style="font-size: 16px;">You have received a new message from your contact form. Below are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Email:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #fff;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Subject:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Message:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 14px; color: #555;">This email was sent from your website's contact form.</p>
      </div>
    `;

    // Call the sendEmail utility function
    await sendEmail({
      subject,
      message: formattedMessage, // Pass the formatted message
    });

    // Respond to the client
    res.status(200).json({
      success: true,
      message: `Email sent successfully to ${email}`,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error("Error in sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
  }
});
