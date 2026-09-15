import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const SMTP_PORT = parseInt(process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.BREVO_SMTP_USER || process.env.SMTP_USER || '';
const SMTP_PASS = process.env.BREVO_SMTP_PASS || process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'sales@megatrixai.com';
const FROM_NAME = process.env.FROM_NAME || 'MegaTrix Global Admin';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // TLS on port 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const mailerxRelay = {
  /**
   * Dispatch an authentic account invitation email
   */
  sendInvitation: async ({ recipientEmail, recipientName, invitationUrl, accessLevel, invitedByName }) => {
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: 'You have been invited to MegaTrix Global Administration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
            .card { background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; max-width: 540px; margin: 0 auto; padding: 32px; }
            .logo { font-size: 20px; font-weight: 800; color: #3b82f6; margin-bottom: 20px; letter-spacing: -0.5px; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); margin-bottom: 20px; }
            .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-top: 24px; margin-bottom: 20px; text-align: center; }
            .footer { font-size: 11px; color: #6b7280; border-top: 1px solid #1f2937; padding-top: 16px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">⚡ MegaTrix Core</div>
            <span class="badge">${accessLevel === 'full' ? 'Full Access Administrator' : 'Granular Access Administrator'}</span>
            <div class="title">Welcome, ${recipientName}</div>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
              <strong>${invitedByName || 'A Superadmin'}</strong> has granted you administrative access to the <strong>MegaTrix Global Platform</strong>.
            </p>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
              Please click the link below to set your password and activate your account. This invitation link is cryptographically secured and will expire in 48 hours.
            </p>
            <a href="${invitationUrl}" class="btn" target="_blank">Set Password & Activate Account →</a>
            <p style="color: #64748b; font-size: 12px; word-break: break-all;">
              Or copy this direct link: <br/>${invitationUrl}
            </p>
            <div class="footer">
              MegaTrix Technologies Enterprise Ecosystem • Automated MailerX Relay Service
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[MailerX] Invitation email dispatched to ${recipientEmail}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.warn(`[MailerX SMTP Warning]: Failed to relay via Brevo: ${error.message}. Returning link directly for local test.`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Dispatch general transactional email (security alert, etc.)
   */
  sendMail: async ({ to, subject, html }) => {
    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to,
        subject,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.warn(`[MailerX] Error: ${err.message}`);
      return { success: false, error: err.message };
    }
  },
};
