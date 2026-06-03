// ─── Shared Pieces ────────────────────────────────────────────────────────────

const LOGO_URL = "https://skillsoora.com/image.svg"

const header = `
<tr>
  <td style="background-color:#ffffff;padding:20px 32px;border-bottom:1px solid #F0F0F0;">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right:10px;vertical-align:middle;">
          <img 
            src="${LOGO_URL}" 
            width="36" 
            height="36" 
            alt="SkillOra Logo"
            style="display:block;width:36px;height:36px;border:0;outline:none;text-decoration:none;border-radius:9px;"
          />
        </td>

        <td style="vertical-align:middle;">
          <span style="font-size:17px;font-weight:800;color:#111827;letter-spacing:-0.4px;">
            Skill<span style="color:#1D4ED8;">Ora</span>
          </span>
        </td>
      </tr>
    </table>
  </td>
</tr>`;


const footer = (year = new Date().getFullYear()) => `
<tr>
  <td style="background-color:#FAFAFA;border-top:1px solid #F0F0F0;
             padding:16px 32px;text-align:center;">
    <p style="margin:0;color:#B0B0B0;font-size:11px;line-height:1.9;">
      &copy; ${year} SkillOra &middot; All rights reserved<br />
      <a href="https://skillsoora.com"
         style="color:#6B7280;text-decoration:none;">skillsoora.com</a>
      &nbsp;&middot;&nbsp;
      <a href="https://skillsoora.com/support"
         style="color:#6B7280;text-decoration:none;">Help Centre</a>
      &nbsp;&middot;&nbsp;
      <a href="https://skillsoora.com/unsubscribe"
         style="color:#6B7280;text-decoration:none;">Unsubscribe</a>
    </p>
  </td>
</tr>`;

const wrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#F5F5F5;
             font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#F5F5F5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" border="0"
               style="max-width:500px;width:100%;background-color:#ffffff;
                      border-radius:16px;border:1px solid #E8E8E8;overflow:hidden;
                      box-shadow:0 2px 16px rgba(0,0,0,0.06);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;



export const welcomeEmailTemplate = ({ name }) => wrapper(`

  ${header}

  <!-- HERO -->
  <tr>
    <td style="background-color:#F8FAFF;padding:38px 32px 34px;
               text-align:center;border-bottom:1px solid #EEF2FF;">
      <p style="margin:0 0 16px;display:inline-block;background-color:#EEF2FF;
                color:#1D4ED8;font-size:10px;font-weight:700;letter-spacing:1px;
                text-transform:uppercase;padding:5px 14px;border-radius:100px;">
        Account Created
      </p>
      <h1 style="margin:0 0 10px;color:#111827;font-size:24px;font-weight:800;
                 letter-spacing:-0.4px;line-height:1.25;">
        Welcome, ${name || "there"}!
      </h1>
      <p style="margin:0;color:#6B7280;font-size:14px;line-height:1.65;">
        You now have access to everything SkillOra has to offer.<br />
        Let&rsquo;s get you started.
      </p>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="padding:28px 32px 22px;">
      <p style="margin:0 0 24px;color:#4B5563;font-size:14px;line-height:1.8;">
        SkillOra is built to serve professionals, teams, and users across every field
        &mdash; giving you the tools, resources, and insights you need in one place.
      </p>

      <!-- Features -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background-color:#FAFAFA;border:1px solid #F0F0F0;
                    border-radius:12px;overflow:hidden;margin-bottom:26px;">
        <tr>
          <td style="padding:13px 16px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:14px;">
                <div style="width:34px;height:34px;background-color:#EEF2FF;border-radius:8px;text-align:center;line-height:34px;">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style="vertical-align:middle;">
                    <rect x="2" y="2" width="14" height="14" rx="3" stroke="#1D4ED8" stroke-width="1.5"/>
                    <path d="M5 9h8M5 6h5M5 12h6" stroke="#1D4ED8" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">Your Dashboard</p>
                <p style="margin:0;color:#9CA3AF;font-size:12px;">Everything in one place, personalised for you.</p>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:13px 16px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:14px;">
                <div style="width:34px;height:34px;background-color:#EEF2FF;border-radius:8px;text-align:center;line-height:34px;">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style="vertical-align:middle;">
                    <circle cx="9" cy="9" r="7" stroke="#1D4ED8" stroke-width="1.5"/>
                    <path d="M9 5v4l3 2" stroke="#1D4ED8" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">Real-Time Features</p>
                <p style="margin:0;color:#9CA3AF;font-size:12px;">Access tools and updates as they happen.</p>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:13px 16px;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:14px;">
                <div style="width:34px;height:34px;background-color:#EEF2FF;border-radius:8px;text-align:center;line-height:34px;">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style="vertical-align:middle;">
                    <path d="M9 2L11.5 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H6.5L9 2Z"
                          stroke="#1D4ED8" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                </div>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">Tailored for Your Field</p>
                <p style="margin:0;color:#9CA3AF;font-size:12px;">Features that match your industry and goals.</p>
              </td>
            </tr></table>
          </td>
        </tr>
      </table>

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <a href="https://skillsoora.com"
               style="display:inline-block;background-color:#1D4ED8;color:#ffffff;
                      font-size:13px;font-weight:700;text-decoration:none;
                      padding:12px 30px;border-radius:9px;letter-spacing:0.2px;">
              Go to My Dashboard &nbsp;&rarr;
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${footer()}
`);



export const otpEmailTemplate = ({ name, otp }) => wrapper(`

  ${header}

  <!-- BODY -->
  <tr>
    <td style="padding:32px 32px 24px;">
      <p style="margin:0 0 6px;color:#1D4ED8;font-size:10px;font-weight:700;
                letter-spacing:1.2px;text-transform:uppercase;">Security Code</p>
      <h1 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:800;
                 letter-spacing:-0.3px;line-height:1.25;">Verify your identity</h1>
      <p style="margin:0 0 24px;color:#4B5563;font-size:14px;line-height:1.8;">
        Hi <strong>${name || "there"}</strong>, here is your one-time verification code.
        It expires in <strong>10 minutes</strong>. Do not share it with anyone.
      </p>

      <!-- OTP Box -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
        <tr>
          <td align="center"
              style="background-color:#F8FAFF;border:1.5px solid #DBEAFE;
                     border-radius:12px;padding:24px 16px;">
            <p style="margin:0 0 10px;color:#1E40AF;font-size:10px;font-weight:700;
                      letter-spacing:1.2px;text-transform:uppercase;">One-Time Password</p>
            <p style="margin:0;font-size:38px;font-weight:800;letter-spacing:14px;
                      color:#1D4ED8;font-family:'Courier New',Courier,monospace;">
              ${otp}
            </p>
          </td>
        </tr>
      </table>

      <!-- Warning -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FFFBEB;border:1px solid #FDE68A;
                     border-radius:9px;padding:12px 16px;">
            <p style="margin:0;color:#92400E;font-size:12px;line-height:1.65;">
              &#9888;&#65039; &nbsp;<strong>Never share this code.</strong>
              SkillOra will never ask for your OTP via email, phone, or chat.
              If you did not request this,
              <a href="https://skillsoora.com/support"
                 style="color:#92400E;font-weight:600;text-decoration:none;">contact support</a> immediately.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${footer()}
`);


// ─────────────────────────────────────────────────────────────────────────────
// 3. PASSWORD EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export const passwordMailTemplate = ({ name, password }) => wrapper(`

  ${header}

  <!-- BODY -->
  <tr>
    <td style="padding:32px 32px 24px;">
      <p style="margin:0 0 6px;color:#1D4ED8;font-size:10px;font-weight:700;
                letter-spacing:1.2px;text-transform:uppercase;">Password Reset</p>
      <h1 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:800;
                 letter-spacing:-0.3px;line-height:1.25;">Your new password is ready</h1>
      <p style="margin:0 0 24px;color:#4B5563;font-size:14px;line-height:1.8;">
        Hi <strong>${name || "there"}</strong>,Your Skillors Password Has Been Reseted.
        Use the temporary password below to sign in, then update it immediately
        from your profile settings.
      </p>

      <!-- Password Box -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td align="center"
              style="background-color:#F8FAFF;border:2px dashed #BFDBFE;
                     border-radius:12px;padding:20px 16px;">
            <p style="margin:0 0 8px;color:#6B7280;font-size:10px;font-weight:700;
                      letter-spacing:1px;text-transform:uppercase;">Temporary Password</p>
            <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:4px;
                      color:#1E40AF;font-family:'Courier New',Courier,monospace;">
              ${password}
            </p>
          </td>
        </tr>
      </table>

      <!-- Steps -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr><td style="padding-bottom:12px;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:top;padding-right:12px;padding-top:1px;">
              <div style="width:24px;height:24px;background-color:#EEF2FF;border-radius:50%;
                          text-align:center;line-height:24px;color:#1D4ED8;font-size:11px;font-weight:800;">1</div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">Sign in</p>
              <p style="margin:0;color:#9CA3AF;font-size:12px;">Visit skillsoora.com and enter your email and the password above.</p>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding-bottom:12px;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:top;padding-right:12px;padding-top:1px;">
              <div style="width:24px;height:24px;background-color:#EEF2FF;border-radius:50%;
                          text-align:center;line-height:24px;color:#1D4ED8;font-size:11px;font-weight:800;">2</div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">Change your password</p>
              <p style="margin:0;color:#9CA3AF;font-size:12px;">Go to Profile &rarr; Security and set a strong new password.</p>
            </td>
          </tr></table>
        </td></tr>
        <tr><td>
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:top;padding-right:12px;padding-top:1px;">
              <div style="width:24px;height:24px;background-color:#EEF2FF;border-radius:50%;
                          text-align:center;line-height:24px;color:#1D4ED8;font-size:11px;font-weight:800;">3</div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">Start exploring</p>
              <p style="margin:0;color:#9CA3AF;font-size:12px;">Discover your dashboard and all features available to you.</p>
            </td>
          </tr></table>
        </td></tr>
      </table>

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
        <tr>
          <td align="center">
            <a href="https://skillsoora.com/login"
               style="display:inline-block;background-color:#1D4ED8;color:#ffffff;
                      font-size:13px;font-weight:700;text-decoration:none;
                      padding:12px 30px;border-radius:9px;letter-spacing:0.2px;">
              Sign in to SkillOra &nbsp;&rarr;
            </a>
          </td>
        </tr>
      </table>

      <!-- Warning -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FFFBEB;border:1px solid #FDE68A;
                     border-radius:9px;padding:12px 16px;">
            <p style="margin:0;color:#92400E;font-size:12px;line-height:1.65;">
              &#9888;&#65039; &nbsp;<strong>This password is temporary.</strong>
              Please update it immediately after your first login to keep your account secure.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${footer()}
`);

export const roleInvitationEmailTemplate = ({
  name,
  hotelName,
  role,
  inviteLink,
  invitedBy,
  expiresIn = "24 hours"
}) => wrapper(`

  ${header}

  <!-- HERO -->
  <tr>
    <td style="background-color:#F8FAFF;padding:38px 32px 34px;
               text-align:center;border-bottom:1px solid #EEF2FF;">
      <p style="margin:0 0 16px;display:inline-block;background-color:#EEF2FF;
                color:#1D4ED8;font-size:10px;font-weight:700;letter-spacing:1px;
                text-transform:uppercase;padding:5px 14px;border-radius:100px;">
        Role Invitation
      </p>

      <h1 style="margin:0 0 10px;color:#111827;font-size:24px;font-weight:800;
                 letter-spacing:-0.4px;line-height:1.25;">
        You&rsquo;re invited to join ${hotelName || "a hotel"}
      </h1>

      <p style="margin:0;color:#6B7280;font-size:14px;line-height:1.65;">
        You have been invited to access this hotel workspace on SkillOra.
      </p>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="padding:28px 32px 24px;">
      <p style="margin:0 0 22px;color:#4B5563;font-size:14px;line-height:1.8;">
        Hi <strong>${name || "there"}</strong>, 
        ${invitedBy ? `<strong>${invitedBy}</strong> has invited you` : `you have been invited`} 
        to join <strong>${hotelName || "this hotel"}</strong> as a 
        <strong style="color:#1D4ED8;text-transform:capitalize;">${role}</strong>.
      </p>

      <!-- Invitation Details -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background-color:#FAFAFA;border:1px solid #F0F0F0;
                    border-radius:12px;overflow:hidden;margin-bottom:24px;">
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align:middle;padding-right:14px;width:36px;">
                  <div style="width:34px;height:34px;background-color:#EEF2FF;border-radius:8px;text-align:center;line-height:34px;">
                    <span style="color:#1D4ED8;font-size:16px;font-weight:800;">🏨</span>
                  </div>
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">
                    Hotel Workspace
                  </p>
                  <p style="margin:0;color:#9CA3AF;font-size:12px;">
                    ${hotelName || "Hotel workspace"}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align:middle;padding-right:14px;width:36px;">
                  <div style="width:34px;height:34px;background-color:#EEF2FF;border-radius:8px;text-align:center;line-height:34px;">
                    <span style="color:#1D4ED8;font-size:16px;font-weight:800;">👤</span>
                  </div>
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">
                    Assigned Role
                  </p>
                  <p style="margin:0;color:#9CA3AF;font-size:12px;text-transform:capitalize;">
                    ${role}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:14px 16px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align:middle;padding-right:14px;width:36px;">
                  <div style="width:34px;height:34px;background-color:#EEF2FF;border-radius:8px;text-align:center;line-height:34px;">
                    <span style="color:#1D4ED8;font-size:16px;font-weight:800;">⏱</span>
                  </div>
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 2px;color:#111827;font-size:13px;font-weight:700;">
                    Invitation Expiry
                  </p>
                  <p style="margin:0;color:#9CA3AF;font-size:12px;">
                    This invitation expires in ${expiresIn}.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;">
        <tr>
          <td align="center">
            <a href="${inviteLink}"
               style="display:inline-block;background-color:#1D4ED8;color:#ffffff;
                      font-size:13px;font-weight:700;text-decoration:none;
                      padding:12px 30px;border-radius:9px;letter-spacing:0.2px;">
              Accept Invitation &nbsp;&rarr;
            </a>
          </td>
        </tr>
      </table>

      <!-- Fallback Link -->
      <p style="margin:0 0 20px;color:#9CA3AF;font-size:12px;line-height:1.7;text-align:center;">
        If the button does not work, copy and paste this link into your browser:
        <br />
        <a href="${inviteLink}" style="color:#1D4ED8;text-decoration:none;word-break:break-all;">
          ${inviteLink}
        </a>
      </p>

      <!-- Warning -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FFFBEB;border:1px solid #FDE68A;
                     border-radius:9px;padding:12px 16px;">
            <p style="margin:0;color:#92400E;font-size:12px;line-height:1.65;">
              &#9888;&#65039; &nbsp;<strong>Security notice:</strong>
              Only accept this invitation if you were expecting access to this hotel.
              If this was not meant for you, you can safely ignore this email.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${footer()}
`);

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD RESET LINK EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export const passwordResetLinkEmailTemplate = ({
  name,
  resetLink,
  expiresIn = "10 minutes",
}) => wrapper(`

  ${header}

  <!-- HERO -->
  <tr>
    <td style="background-color:#F8FAFF;padding:38px 32px 34px;
               text-align:center;border-bottom:1px solid #EEF2FF;">
      <p style="margin:0 0 16px;display:inline-block;background-color:#EEF2FF;
                color:#1D4ED8;font-size:10px;font-weight:700;letter-spacing:1px;
                text-transform:uppercase;padding:5px 14px;border-radius:100px;">
        Password Reset
      </p>

      <h1 style="margin:0 0 10px;color:#111827;font-size:24px;font-weight:800;
                 letter-spacing:-0.4px;line-height:1.25;">
        Reset your password
      </h1>

      <p style="margin:0;color:#6B7280;font-size:14px;line-height:1.65;">
        We received a request to reset your SkillOra account password.
      </p>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="padding:28px 32px 24px;">
      <p style="margin:0 0 22px;color:#4B5563;font-size:14px;line-height:1.8;">
        Hi <strong>${name || "there"}</strong>, click the button below to create a new password.
        This password reset link will expire in <strong>${expiresIn}</strong>.
      </p>

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td align="center">
            <a href="${resetLink}"
               style="display:inline-block;background-color:#1D4ED8;color:#ffffff;
                      font-size:13px;font-weight:700;text-decoration:none;
                      padding:12px 30px;border-radius:9px;letter-spacing:0.2px;">
              Reset Password &nbsp;&rarr;
            </a>
          </td>
        </tr>
      </table>

      <!-- Fallback Link -->
      <p style="margin:0 0 22px;color:#9CA3AF;font-size:12px;line-height:1.7;text-align:center;">
        If the button does not work, copy and paste this link into your browser:
        <br />
        <a href="${resetLink}" style="color:#1D4ED8;text-decoration:none;word-break:break-all;">
          ${resetLink}
        </a>
      </p>

      <!-- Info Box -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
        <tr>
          <td style="background-color:#FAFAFA;border:1px solid #F0F0F0;
                     border-radius:12px;padding:14px 16px;">
            <p style="margin:0;color:#4B5563;font-size:12px;line-height:1.7;">
              After resetting your password, you can sign in again using your new password.
              For security reasons, this link can only be used once.
            </p>
          </td>
        </tr>
      </table>

      <!-- Warning -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#FFFBEB;border:1px solid #FDE68A;
                     border-radius:9px;padding:12px 16px;">
            <p style="margin:0;color:#92400E;font-size:12px;line-height:1.65;">
              &#9888;&#65039; &nbsp;<strong>Security notice:</strong>
              If you did not request a password reset, you can safely ignore this email.
              Your password will remain unchanged.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${footer()}
`);