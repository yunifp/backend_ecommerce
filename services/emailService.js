// services/emailService.js
const nodemailer = require("nodemailer");

// 1. Buat 'transporter' (mesin pengirim)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Mengirim email verifikasi dengan OTP
 * @param {string} toEmail - Email penerima
 * @param {string} otp - Kode OTP 6 digit
 */
const sendVerificationEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Kode Verifikasi Akun Anda",
    html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Verifikasi Email Anda</h2>
        <p>Gunakan kode di bawah ini untuk memverifikasi akun Anda:</p>
        <h1 style="font-size: 48px; letter-spacing: 10px; margin: 20px 0;">
          ${otp}
        </h1>
        <p>Kode ini akan kedaluwarsa dalam 10 menit.</p>
        <p style="color: #888;">Jika Anda tidak mendaftar, abaikan email ini.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error("Failed to send verification email");
  }
};
/**
 * Mengirim email reset password dengan link
 * @param {string} toEmail - Email penerima
 * @param {string} token - Token reset (yang plain text)
 */
const sendPasswordResetEmail = async (toEmail, token) => {
  // Buat link reset-nya
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Link Reset Password Anda',
    html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Lupa Password?</h2>
        <p>Klik tombol di bawah ini untuk mereset password Anda.</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          margin: 20px 0;
          font-size: 16px;
          color: #ffffff;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
        ">
          Reset Password
        </a>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
        <p style="color: #888;">Jika Anda tidak meminta ini, abaikan email ini.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail // <-- Ekspor fungsi baru
};
