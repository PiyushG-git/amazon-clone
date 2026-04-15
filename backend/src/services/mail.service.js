import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
});

// Verify connection configuration
if (process.env.GOOGLE_USER) {
    transporter.verify()
        .then(() => { console.log("Email transporter is ready to send emails"); })
        .catch((err) => { console.error("Email transporter verification failed:", err); });
} else {
    console.warn("Email transporter skipped (GOOGLE_USER not set)");
}

/**
 * Sends a professional HTML email
 * @param {Object} options 
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text fallback
 */
export async function sendEmail({ to, subject, html, text }) {
    const mailOptions = {
        from: `"Amazon Clone" <${process.env.GOOGLE_USER}>`,
        to,
        subject,
        html,
        text
    };

    try {
        const details = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}:`, details.messageId);
        return details;
    } catch (err) {
        console.error(`Failed to send email to ${to}:`, err.message);
        // We don't throw here to avoid breaking the order flow if email fails
        return null;
    }
}
