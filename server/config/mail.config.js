import nodemailer from "nodemailer"
import dns from 'node:dns'

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4, 

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  logger: true,
  debug: true,
});

export const verifyMailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Mail server is ready to send emails");
  } catch (error) {
    console.error("Mail server connection failed:", error.message);
  }
};

export default transporter;