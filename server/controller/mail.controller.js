import resend from "../config/mail.config.js";

import {
  welcomeEmailTemplate,
  otpEmailTemplate,
  passwordMailTemplate,
  roleInvitationEmailTemplate,
  passwordResetLinkEmailTemplate,
} from "../temp/emailTemplate.js";

const getSender = () => {
  return `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM}>`;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const { data, error } = await resend.emails.send({
    from: getSender(),
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Email sending failed");
  }

  return data;
};

export const sendWelcomeMail = async ({ email, name }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const data = await sendEmail({
    to: email,
    subject: "Welcome to Skillora",
    text: `Hello ${name || "User"}, welcome to Skillora.`,
    html: welcomeEmailTemplate({ name }),
  });

  return {
    success: true,
    message: "Welcome email sent successfully",
    messageId: data?.id,
  };
};

export const sendOtpMail = async ({ email, name, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const data = await sendEmail({
    to: email,
    subject: "Your Skillora Verification Code",
    text: `Your Skillora OTP code is ${otp}`,
    html: otpEmailTemplate({ name, otp }),
  });

  return {
    success: true,
    message: "OTP email sent successfully",
    messageId: data?.id,
  };
};

export const sendCustomMail = async ({ email, subject, message }) => {
  if (!email || !subject || !message) {
    throw new Error("Email, subject, and message are required");
  }

  const data = await sendEmail({
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
  });

  return {
    success: true,
    message: "Email sent successfully",
    messageId: data?.id,
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

    const data = await sendEmail({
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
      messageId: data?.id,
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

  const data = await sendEmail({
    to: email,
    subject: "Your Skillora Account Password",
    text: `Hello ${name || "User"}, your Skillora password is: ${password}`,
    html: passwordMailTemplate({
      name,
      password,
    }),
  });

  return {
    success: true,
    message: "Password email sent successfully",
    messageId: data?.id,
  };
};

export const sendRoleInvitationMail = async ({
  email,
  name,
  hotelName,
  role,
  inviteLink,
  invitedBy,
  expiresIn = "24 hours",
}) => {
  if (!email || !hotelName || !role || !inviteLink) {
    throw new Error("Email, hotel name, role, and invite link are required");
  }

  const data = await sendEmail({
    to: email,
    subject: `Invitation to join ${hotelName} on SkillOra`,
    text: `Hello ${name || "User"},

You have been invited ${invitedBy ? `by ${invitedBy} ` : ""}to join ${hotelName} as ${role}.

Accept your invitation using this link:
${inviteLink}

This invitation expires in ${expiresIn}.

If you were not expecting this invitation, you can safely ignore this email.

Best regards,
SkillOra Team`,
    html: roleInvitationEmailTemplate({
      name,
      hotelName,
      role,
      inviteLink,
      invitedBy,
      expiresIn,
    }),
  });

  return {
    success: true,
    message: "Role invitation email sent successfully",
    messageId: data?.id,
  };
};

export const sendPasswordResetLink = async ({
  email,
  name,
  resetLink,
  expiresIn = "10 minutes",
}) => {
  if (!email || !resetLink) {
    throw new Error("Email and reset link are required");
  }

  const data = await sendEmail({
    to: email,
    subject: "Reset your SkillOra password",
    text: `Hello ${name || "User"},

We received a request to reset your SkillOra account password.

Reset your password using this link:
${resetLink}

This password reset link expires in ${expiresIn}.

If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
SkillOra Team`,
    html: passwordResetLinkEmailTemplate({
      name,
      resetLink,
      expiresIn,
    }),
  });

  return {
    success: true,
    message: "Password reset email sent successfully",
    messageId: data?.id,
  };
};