import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, phone, subject, message } = await req.json();

  if (!name || !email || !message)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const apiKey   = process.env.RESEND_API_KEY;
  const toEmail  = process.env.TEAM_EMAIL || process.env.HOST_EMAIL;
  const fromAddr = process.env.RESEND_FROM || "AgroWave Contact <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json({ success: true, simulated: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:     fromAddr,
        to:       toEmail ? [toEmail] : ["onboarding@resend.dev"],
        reply_to: email,
        subject:  `[AgroWave] ${subject || "New Message"} — ${name}`,
        html: `
<div style="font-family:'DM Sans',system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
  <div style="background:linear-gradient(135deg,#059669,#10B981);padding:28px 32px;">
    <h1 style="color:#fff;font-size:22px;margin:0;">🌱 New Message — AgroWave</h1>
    <p style="color:#A7F3D0;margin:6px 0 0;font-size:14px;">Smart Farming Platform · Contact Form</p>
  </div>
  <div style="padding:32px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;width:100px;">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;"><a href="mailto:${email}" style="color:#059669;">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${phone}</td></tr>` : ""}
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;">Topic</td>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-weight:600;color:#1E293B;">${subject || "General Inquiry"}</td></tr>
    </table>
    <div style="margin-top:24px;background:#F0FDF4;border-radius:12px;padding:20px;border-left:4px solid #10B981;">
      <p style="color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Message</p>
      <p style="color:#1E293B;line-height:1.7;margin:0;font-size:15px;">${message.replace(/\n/g, "<br/>")}</p>
    </div>
    <div style="margin-top:16px;padding:12px 16px;background:#F8FAFC;border-radius:10px;font-size:12px;color:#94A3B8;">
      Received via AgroWave · Reply-to goes to ${email} · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
    </div>
  </div>
</div>`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(()=>({}));
      console.error("[contact] send error:", err);
      return NextResponse.json({ error: "Message delivery failed. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[contact] exception:", e);
    return NextResponse.json({ error: "Network error. Please try again." }, { status: 500 });
  }
}
