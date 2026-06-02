import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, phone, subject, message } = await req.json();
  if (!name || !email || !message)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.HOST_EMAIL || "hello@agrowave.farm";

  if (!apiKey) {
    // Fallback: just acknowledge without actually sending
    return NextResponse.json({
      success: true,
      msg: `Thanks ${name}, message received! We'll reply to ${email} within 24h.`,
      simulated: true,
    });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AgroWave Contact <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `[AgroWave] ${subject || "New Contact"} — from ${name}`,
        html: `
          <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
            <div style="background:linear-gradient(135deg,#059669,#10B981);padding:28px 32px;">
              <h1 style="color:#fff;font-size:22px;margin:0;">🌱 New Contact from AgroWave</h1>
              <p style="color:#A7F3D0;margin:6px 0 0;font-size:14px;">Smart Farming Platform</p>
            </div>
            <div style="padding:32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;width:100px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${name}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${email}</td></tr>
                ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${phone}</td></tr>` : ""}
                <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;">Subject</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${subject}</td></tr>
              </table>
              <div style="margin-top:24px;background:#F0FDF4;border-radius:12px;padding:20px;border-left:4px solid #10B981;">
                <p style="color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Message</p>
                <p style="color:#1E293B;line-height:1.7;margin:0;font-size:15px;">${message.replace(/\n/g, "<br/>")}</p>
              </div>
              <div style="margin-top:28px;padding:20px;background:#EFF6FF;border-radius:12px;font-size:13px;color:#64748B;">
                <strong>Sent via AgroWave Contact Form</strong> · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </div>
            </div>
          </div>`,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Email send failed", detail: err }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      msg: `Thanks ${name}, your message has been sent! We'll reply to ${email} within 24h.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
