import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Bibliothèque" <${process.env.BREVO_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email envoyé :', info.messageId);
  } catch (error) {
    console.error('Erreur lors de l’envoi du mail :', error);
  }
}
