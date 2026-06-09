import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // === RESEND INTEGRATION ===
    // Set RESEND_API_KEY and HOST_EMAIL in .env.local to enable real emails
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const HOST_EMAIL = process.env.HOST_EMAIL || "hello@agrowave.farm";

    if (RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);

      // Notification email to YOU (farm owner)
      await resend.emails.send({
        from: "AgroWave Contact <onboarding@resend.dev>",
        to: [HOST_EMAIL],
        subject: `📬 [AgroWave] New Message: ${subject || "Contact Form"}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"/></head>
          <body style="font-family:'DM Sans',system-ui,sans-serif;background:#F0FDF4;margin:0;padding:24px;">
            <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1.5px solid #A7F3D0;box-shadow:0 8px 32px rgba(16,185,129,0.1);">
              <!-- Header -->
              <div style="background:linear-gradient(135deg,#059669,#10B981);padding:28px 32px;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span style="font-size:28px;">🌾</span>
                  <div>
                    <p style="color:#D1FAE5;font-size:11px;font-weight:700;letter-spacing:0.1em;margin:0;">AGROWAVE</p>
                    <p style="color:#fff;font-size:18px;font-weight:700;margin:2px 0 0;">New Contact Message</p>
                  </div>
                </div>
              </div>
              <!-- Content -->
              <div style="padding:28px 32px;">
                <p style="color:#64748B;font-size:13px;margin:0 0 20px;">You received a new message from your AgroWave contact form.</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;vertical-align:top;width:100px;color:#94A3B8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">NAME</td>
                    <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${name}</td></tr>
                  <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;vertical-align:top;color:#94A3B8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">EMAIL</td>
                    <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#059669;font-weight:600;"><a href="mailto:${email}" style="color:#059669;text-decoration:none;">${email}</a></td></tr>
                  ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#94A3B8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">PHONE</td>
                    <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#1E293B;">${phone}</td></tr>` : ""}
                  <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#94A3B8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">SUBJECT</td>
                    <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#1E293B;">${subject || "General Inquiry"}</td></tr>
                  <tr><td style="padding:14px 0;vertical-align:top;color:#94A3B8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">MESSAGE</td>
                    <td style="padding:14px 0;color:#1E293B;line-height:1.7;">${message.replace(/\n/g,"<br/>")}</td></tr>
                </table>
                <div style="margin-top:24px;padding:16px;background:#F0FDF4;border-radius:12px;border:1.5px solid #A7F3D0;">
                  <p style="color:#059669;font-size:12px;font-weight:700;margin:0 0 4px;">⚡ Quick Reply</p>
                  <a href="mailto:${email}?subject=Re: ${subject || "Your AgroWave Inquiry"}" style="color:#047857;font-size:13px;">Reply to ${name} →</a>
                </div>
              </div>
              <div style="background:#F8FAFC;padding:16px 32px;text-align:center;">
                <p style="color:#94A3B8;font-size:11px;margin:0;">AgroWave Smart Farming · Hyderabad, India · <a href="mailto:${HOST_EMAIL}" style="color:#059669;text-decoration:none;">${HOST_EMAIL}</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      // Auto-reply to sender
      await resend.emails.send({
        from: "AgroWave Support <onboarding@resend.dev>",
        to: [email],
        subject: "✅ We received your message — AgroWave",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family:'DM Sans',system-ui,sans-serif;background:#F0FDF4;margin:0;padding:24px;">
            <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1.5px solid #A7F3D0;box-shadow:0 4px 24px rgba(16,185,129,0.08);">
              <div style="background:linear-gradient(135deg,#059669,#10B981);padding:28px 32px;text-align:center;">
                <span style="font-size:40px;">🌾</span>
                <h1 style="color:#fff;font-size:22px;margin:12px 0 4px;">Message Received!</h1>
                <p style="color:#D1FAE5;font-size:13px;margin:0;">We'll get back to you within 24 hours</p>
              </div>
              <div style="padding:28px 32px;">
                <p style="color:#1E293B;font-size:15px;line-height:1.7;margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
                <p style="color:#64748B;font-size:14px;line-height:1.7;margin:0 0 24px;">Thank you for reaching out! We've received your message about "<strong>${subject || "General Inquiry"}</strong>" and our team will review it shortly.</p>
                <div style="background:#F0FDF4;border:1.5px solid #A7F3D0;border-radius:12px;padding:16px;margin-bottom:24px;">
                  <p style="color:#94A3B8;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">YOUR MESSAGE</p>
                  <p style="color:#1E293B;font-size:13px;line-height:1.6;margin:0;">${message.substring(0,200)}${message.length>200?"…":""}</p>
                </div>
                <p style="color:#64748B;font-size:13px;">While you wait — explore the live farm dashboard at <a href="${process.env.NEXTAUTH_URL||"https://agrowave.farm"}" style="color:#059669;">agrowave.farm</a>.</p>
              </div>
              <div style="background:#F8FAFC;padding:16px 32px;text-align:center;">
                <p style="color:#94A3B8;font-size:11px;margin:0;">AgroWave · Kisan Helpline: 1800-180-1551 · ${HOST_EMAIL}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      emailSent: !!RESEND_API_KEY,
    });

  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
