import resend from "../config/mail.config.js";

import {
  welcomeEmailTemplate,
  otpEmailTemplate,
  passwordMailTemplate,
  roleInvitationEmailTemplate,
  passwordResetLinkEmailTemplate,
  reservationConfirmationEmailTemplate,
  reservationStatusUpdateEmailTemplate
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

const formatMailLabel = (value = "") => {
  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatMailDate = (value, timeZone = "Asia/Kathmandu") => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }
};

const formatMailMoney = (amount = 0, currency = "Rs.") => {
  const numericAmount = Number(amount);

  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;

  return `${currency} ${safeAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getRoomsText = (rooms = []) => {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return "Room details will be provided by the hotel";
  }

  return rooms
    .map((room, index) => {
      if (typeof room === "string" || typeof room === "number") {
        return `Room ${room}`;
      }

      const roomNumber =
        room?.roomNumber || room?.number || room?.name || index + 1;

      const categoryName =
        room?.categoryName || room?.category?.name || room?.roomCategory || "";

      const floor =
        room?.floor !== undefined && room?.floor !== null
          ? `Floor ${room.floor}`
          : "";

      const details = [categoryName, floor].filter(Boolean);

      return details.length > 0
        ? `Room ${roomNumber} (${details.join(", ")})`
        : `Room ${roomNumber}`;
    })
    .join(", ");
};

export const sendWelcomeMail = async ({ email, name }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const data = await sendEmail({
    to: email,
    subject: "Welcome to Skillora",
    text: `Hello ${name || "User"}, welcome to Skillora.`,
    html: welcomeEmailTemplate({
      name,
    }),
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
    html: otpEmailTemplate({
      name,
      otp,
    }),
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
      <div
        style="
          font-family:Arial,sans-serif;
          line-height:1.6;
        "
      >
        <p>${message}</p>

        <br />

        <p>
          Best regards,
          <br />
          Skillora Team
        </p>
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
    if (!user.email) {
      continue;
    }

    const data = await sendEmail({
      to: user.email,
      subject,

      text: `Hello ${user.name || "User"}, ${message}`,

      html: `
        <div
          style="
            font-family:Arial,sans-serif;
            line-height:1.6;
          "
        >
          <p>
            Hello ${user.name || "User"},
          </p>

          <p>${message}</p>

          <br />

          <p>
            Best regards,
            <br />
            Skillora Team
          </p>
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

  const text = `
Hello ${name || "User"},

You have been invited ${
    invitedBy ? `by ${invitedBy} ` : ""
  }to join ${hotelName} as ${role}.

Accept your invitation using this link:
${inviteLink}

This invitation expires in ${expiresIn}.

If you were not expecting this invitation, you can safely ignore this email.

Best regards,
SkillOra Team
    `.trim();

  const data = await sendEmail({
    to: email,

    subject: `Invitation to join ${hotelName} on SkillOra`,

    text,

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

  const text = `
Hello ${name || "User"},

We received a request to reset your Skillora account password.

Reset your password using this link:
${resetLink}

This password reset link expires in ${expiresIn}.

If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
SkillOra Team
    `.trim();

  const data = await sendEmail({
    to: email,

    subject: "Reset your SkillOra password",

    text,

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

export const sendReservationConfirmationMail = async ({
  email,
  guestName,
  hotelName,
  confirmationCode,
  status = "confirmed",

  checkIn,
  checkOut,
  estimatedCheckInTime,
  nights,
  adults = 1,
  children = 0,
  rooms = [],

  paymentStatus = "unpaid",
  paymentMethod,
  transactionId,
  reservationFee = 0,
  amountPaid = 0,
  remainingAmount = 0,
  totalAmount = 0,

  source,
  specialRequests,

  hotelAddress,
  hotelPhone,
  hotelEmail,

  reservationUrl,

  cancellationReason,
  refundAmount = 0,

  currency = "Rs.",
  timeZone = "Asia/Kathmandu",
}) => {
  if (!email) {
    throw new Error("Guest email is required");
  }

  if (!hotelName) {
    throw new Error("Hotel name is required");
  }

  if (!confirmationCode) {
    throw new Error("Confirmation code is required");
  }

  if (!checkIn || !checkOut) {
    throw new Error("Check-in and check-out dates are required");
  }

  const safeRemainingAmount = Math.max(0, Number(remainingAmount) || 0);

  const safeAmountPaid = Math.max(0, Number(amountPaid) || 0);

  const safeTotalAmount = Math.max(0, Number(totalAmount) || 0);

  const safeReservationFee = Math.max(0, Number(reservationFee) || 0);

  const roomsText = getRoomsText(rooms);

  const statusText = formatMailLabel(status);

  const paymentStatusText = formatMailLabel(paymentStatus);

  const subject =
    String(status).toLowerCase() === "confirmed"
      ? `Reservation confirmed — ${confirmationCode}`
      : String(status).toLowerCase() === "cancelled"
        ? `Reservation cancelled — ${confirmationCode}`
        : `Reservation details — ${confirmationCode}`;

  const text = `
Hello ${guestName || "Guest"},

Your reservation details for ${hotelName} are below.

RESERVATION DETAILS

Confirmation code: ${confirmationCode}
Reservation status: ${statusText}
Check-in: ${formatMailDate(checkIn, timeZone)}
Check-out: ${formatMailDate(checkOut, timeZone)}
${
  estimatedCheckInTime
    ? `Estimated check-in time: ${estimatedCheckInTime}\n`
    : ""
}Adults: ${adults}
Children: ${children}
Rooms: ${roomsText}

BILLING DETAILS

Total amount: ${formatMailMoney(safeTotalAmount, currency)}
Reservation fee: ${formatMailMoney(safeReservationFee, currency)}
Amount paid: ${formatMailMoney(safeAmountPaid, currency)}
Remaining amount: ${formatMailMoney(safeRemainingAmount, currency)}
Payment status: ${paymentStatusText}
${paymentMethod ? `Payment method: ${formatMailLabel(paymentMethod)}\n` : ""}${
    transactionId ? `Transaction ID: ${transactionId}\n` : ""
  }${source ? `Reservation source: ${formatMailLabel(source)}\n` : ""}${
    specialRequests ? `Special requests: ${specialRequests}\n` : ""
  }${
    String(status).toLowerCase() === "cancelled" && cancellationReason
      ? `Cancellation reason: ${cancellationReason}\n`
      : ""
  }${
    Number(refundAmount) > 0
      ? `Refund amount: ${formatMailMoney(refundAmount, currency)}\n`
      : ""
  }

${
  safeRemainingAmount > 0
    ? `${formatMailMoney(
        safeRemainingAmount,
        currency,
      )} remains due. Please contact the hotel for payment instructions.`
    : "No payment is currently due."
}

${reservationUrl ? `View reservation: ${reservationUrl}\n` : ""}${
    hotelAddress ? `${hotelAddress}\n` : ""
  }${hotelPhone ? `Phone: ${hotelPhone}\n` : ""}${
    hotelEmail ? `Email: ${hotelEmail}\n` : ""
  }

Best regards,
${hotelName}
    `.trim();

  const html = reservationConfirmationEmailTemplate({
    guestName,
    hotelName,
    confirmationCode,
    status,

    checkIn,
    checkOut,
    estimatedCheckInTime,
    nights,
    adults,
    children,
    rooms,

    paymentStatus,
    paymentMethod,
    transactionId,
    reservationFee: safeReservationFee,
    amountPaid: safeAmountPaid,
    remainingAmount: safeRemainingAmount,
    totalAmount: safeTotalAmount,

    source,
    specialRequests,

    hotelAddress,
    hotelPhone,
    hotelEmail,

    reservationUrl,

    cancellationReason,
    refundAmount,

    currency,
    timeZone,
  });

  const data = await sendEmail({
    to: email,
    subject,
    text,
    html,
  });

  return {
    success: true,
    message: "Reservation email sent successfully",
    messageId: data?.id,
  };
};

export const sendReservationStatusUpdateMail = async ({
  email,
  guestName,
  hotelName,
  confirmationCode,
  oldStatus,
  newStatus,
  reservationUrl,
}) => {
  if (!email) {
    throw new Error("Guest email is required");
  }

  if (!confirmationCode) {
    throw new Error("Confirmation code is required");
  }

  if (!newStatus) {
    throw new Error("New reservation status is required");
  }

  const formattedStatus = String(newStatus)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const data = await sendEmail({
    to: email,

    subject:
      `Reservation status updated — ${confirmationCode}`,

    text: `
Dear ${guestName || "Guest"},

Your reservation with confirmation code ${confirmationCode} has been updated.

New reservation status: ${formattedStatus}

${
  oldStatus
    ? `Previous status: ${String(oldStatus).replaceAll("_", " ")}`
    : ""
}

${
  reservationUrl
    ? `View your reservation: ${reservationUrl}`
    : ""
}

Please contact ${hotelName || "the hotel"} if you have any questions.

Best regards,
${hotelName || "SkillOra Team"}
    `.trim(),

    html:
      reservationStatusUpdateEmailTemplate({
        guestName,
        hotelName,
        confirmationCode,
        oldStatus,
        newStatus,
        reservationUrl,
      }),
  });

  return {
    success: true,
    message:
      "Reservation status email sent successfully",
    messageId: data?.id,
  };
};