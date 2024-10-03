import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config()

// Configure the transporter
const  transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP to admin
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "angeiracyadukunda@gmail.com",
    subject: 'Verify Your Account',
    text: `Your OTP for verification is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

// Send user credentials
const sendCredentials = (email, password, role) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "angeiracyadukunda@gmail.com",
    subject: 'Your Login Credentials',
    text: `You have been assigned the role of ${role}. Your login password is: ${password}`,
  };

  return transporter.sendMail(mailOptions);
};

// Send password reset token
const sendResetToken = (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "angeiracyadukunda@gmail.com",
    subject: 'Password Reset Request',
    text: `Here is your password reset token: ${token}`,
  };

  return transporter.sendMail(mailOptions);
};

// Export the email services
const emailServices = {
  sendOTP,
  sendCredentials,
  sendResetToken,
}

export default emailServices;