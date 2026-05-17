import transporter from "../config/mail.config.js";

import { welcomeEmailTemplate,otpEmailTemplate, passwordMailTemplate } from "../temp/emailTemplate.js";

const getSender = () => {
  return `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`;
};

export const sendWelcomeMail = async ({ email, name }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const mailOptions = {
    from: getSender(),
    to: email,
    subject: "Welcome to Skillora",
    text: `Hello ${name || "User"}, welcome to Skillora.`,
    html: welcomeEmailTemplate({ name }),
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    message: "Welcome email sent successfully",
    messageId: info.messageId,
  };
};

export const sendOtpMail = async ({ email, name, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const mailOptions = {
    from: getSender(),
    to: email,
    subject: "Your Skillora Verification Code",
    text: `Your Skillora OTP code is ${otp}`,
    html: otpEmailTemplate({ name, otp }),
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    message: "OTP email sent successfully",
    messageId: info.messageId,
  };
};

export const sendCustomMail = async ({ email, subject, message }) => {
  if (!email || !subject || !message) {
    throw new Error("Email, subject, and message are required");
  }

  const mailOptions = {
    from: getSender(),
    to: email,
    subject,
    text: message,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>${message}</p>
        <br />
        <p>Best regards,<br />Skillora Team</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    message: "Email sent successfully",
    messageId: info.messageId,
  };
};

export const sendBulkMail = async ({ users, subject, message }) => {
  if (!users || !Array.isArray(users) || users.length === 0) {
    throw new Error("Users array is required");
  }

  if (!subject || !message) {
    throw new Error("Subject and message are required");
  }

  const results = [];

  for (const user of users) {
    if (!user.email) continue;

    const info = await transporter.sendMail({
      from: getSender(),
      to: user.email,
      subject,
      text: `Hello ${user.name || "User"}, ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Hello ${user.name || "User"},</p>
          <p>${message}</p>
          <br />
          <p>Best regards,<br />Skillora Team</p>
        </div>
      `,
    });

    results.push({
      email: user.email,
      status: "sent",
      messageId: info.messageId,
    });
  }

  return {
    success: true,
    message: "Bulk emails sent successfully",
    totalSent: results.length,
    results,
  };
};


export const sendPasswordMail = async ({ email, name, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const info = await transporter.sendMail({
    from: getSender(),
    to: email,
    subject: "Your Skillora Account Password",
    text: `Hello ${name || "User"}, your Skillora password is: ${password}`,
    html: passwordMailTemplate({name:name,password:password})
  });

  return {
    success: true,
    message: "Password email sent successfully",
    messageId: info.messageId,
  };
};