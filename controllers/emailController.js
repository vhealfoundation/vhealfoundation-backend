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
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #003153; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
        <h2 style="color: #fff; margin: 0;">New Contact Form Submission</h2>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333;">You have received a new message from your website's contact form. Below are the details:</p>
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
        <p style="font-size: 16px; color: #555; margin-top: 20px;">
          Please respond to this inquiry as soon as possible.
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${email}" 
             style="background-color: #003153; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Reply to Sender
          </a>
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="font-size: 14px; color: #777; margin: 0;">
          This email was sent from your website's contact form.
        </p>
      </div>
    </div>
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
