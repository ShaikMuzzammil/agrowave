import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const apiKey = process.env.RESEND_API_KEY;
    const hostEmail = process.env.HOST_EMAIL;
    if (!apiKey || !hostEmail) {
      console.log("[Contact] Dev mode – message logged:", { name, email, subject });
      return NextResponse.json({ success: true });
    }
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "AgroWave <onboarding@resend.dev>",
      to: [hostEmail],
      replyTo: email,
      subject: `[AgroWave] ${subject || "New message"} – ${name}`,
      html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#15803d,#22c55e);padding:24px 28px">
          <h2 style="color:white;margin:0;font-size:18px">🌾 AgroWave Contact Message</h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">New message from your farm platform</p>
        </div>
        <div style="padding:24px 28px;font-size:14px;color:#0f172a">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#16a34a">${email}</a></p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
          <p style="margin-top:16px;padding:14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;line-height:1.6">${message.replace(/\n/g, "<br/>")}</p>
        </div>
        <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8">
          AgroWave Smart Farming · KHARIF 2026
        </div>
      </div>`,
    });
    if (error) return NextResponse.json({ error: "Send failed" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
