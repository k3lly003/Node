import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';


const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
