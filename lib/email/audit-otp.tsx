export function renderOtpEmail(otp: string, websiteUrl: string, fullName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <!-- Header -->
      <tr><td style="background:#0A0F1E;padding:32px 40px;text-align:center">
        <p style="margin:0;color:#EC4899;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Ascelo AI</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700">Verify Your Email</h1>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:40px">
        <p style="margin:0 0 16px;color:#374151;font-size:16px">Hi ${fullName},</p>
        <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6">
          We received a request to audit <strong style="color:#0A0F1E">${websiteUrl}</strong>. Enter the code below to verify your email and start your free audit.
        </p>
        <!-- OTP Box -->
        <div style="background:#f9fafb;border:2px dashed #EC4899;border-radius:12px;padding:32px;text-align:center;margin:0 0 32px">
          <p style="margin:0 0 8px;color:#6b7280;font-size:13px;letter-spacing:1px;text-transform:uppercase">Your verification code</p>
          <p style="margin:0;color:#0A0F1E;font-size:48px;font-weight:800;letter-spacing:12px">${otp}</p>
          <p style="margin:12px 0 0;color:#9ca3af;font-size:12px">Expires in 15 minutes</p>
        </div>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6">
          If you didn't request this, you can safely ignore this email — no audit will be run.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px">
        <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center">
          Ascelo AI · 421 7 Ave SW, Floor 30, Calgary, AB T2P 4K9<br>
          Questions? <a href="mailto:info@ascelo.ai" style="color:#EC4899">info@ascelo.ai</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
