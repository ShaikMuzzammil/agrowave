import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, email, phone, subject, message } = body;
  if (!name || !email || !message)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const apiKey  = process.env.RESEND_API_KEY ?? "";
  const toEmail = process.env.TEAM_EMAIL || process.env.HOST_EMAIL || "";

  /* ── Skip email when no real Resend key is configured ── */
  const isRealKey = apiKey.startsWith("re_") && apiKey.length > 25 && !apiKey.includes("xxxx");
  if (!isRealKey || !toEmail) {
    console.log("[contact] No email config — acknowledged locally:", { name, email, subject });
    return NextResponse.json({ success: true });
  }

  /* ── Always send FROM Resend's pre-verified sender ──────────────────────
     Using onboarding@resend.dev works on ALL Resend accounts including free
     tier WITHOUT any domain verification.  The reply-to is set to the
     submitter's email so you can reply directly to them from your inbox.
     RESEND_FROM is ignored — it requires a verified custom domain to work,
     which most portfolio setups don't have configured.
  ──────────────────────────────────────────────────────────────────────── */
  const FROM = "AgroWave <onboarding@resend.dev>";

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0FDF4;font-family:'Segoe UI',system-ui,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#059669 0%,#10B981 100%);padding:32px 36px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">🌾</div>
      <div>
        <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0;line-height:1.2;">AgroWave</h1>
        <p style="color:#A7F3D0;font-size:12px;margin:2px 0 0;font-weight:500;">Smart Farming Platform</p>
      </div>
    </div>
    <p style="color:#D1FAE5;font-size:14px;margin:0;">📨 New contact form submission</p>
  </div>

  <!-- Body -->
  <div style="padding:32px 36px;">

    <!-- Sender details -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;width:110px;">Name</td>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:15px;font-weight:700;color:#0F172A;">${name}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Email</td>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:15px;font-weight:700;">
          <a href="mailto:${email}" style="color:#059669;text-decoration:none;">${email}</a>
        </td>
      </tr>
      ${phone ? `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Phone</td>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:15px;font-weight:700;color:#0F172A;">${phone}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Topic</td>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:15px;font-weight:700;color:#0F172A;">${subject || "General Inquiry"}</td>
      </tr>
    </table>

    <!-- Message -->
    <div style="background:#F0FDF4;border-radius:14px;padding:22px;border-left:4px solid #10B981;margin-bottom:20px;">
      <p style="color:#064E3B;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Message</p>
      <p style="color:#1E293B;line-height:1.8;margin:0;font-size:15px;white-space:pre-wrap;">${message.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
    </div>

    <!-- Reply prompt -->
    <div style="background:#EFF6FF;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <div style="font-size:20px;">💬</div>
      <div>
        <p style="margin:0;font-size:13px;font-weight:700;color:#1E40AF;">Reply directly to this email</p>
        <p style="margin:4px 0 0;font-size:12px;color:#3B82F6;">Your reply goes straight to <strong>${email}</strong></p>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #F1F5F9;padding-top:16px;font-size:11px;color:#94A3B8;">
      <p style="margin:0;">Received via AgroWave Contact Form · ${timestamp} IST</p>
      <p style="margin:4px 0 0;">
        <a href="https://agrowave.vercel.app" style="color:#10B981;text-decoration:none;">agrowave.vercel.app</a>
      </p>
    </div>
  </div>
</div>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:     FROM,
        to:       [toEmail],
        reply_to: email,
        subject:  `[AgroWave] New message from ${name} — ${subject || "General Inquiry"}`,
        html,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[contact] Resend rejected:", JSON.stringify(data));
      return NextResponse.json(
        { error: `Email delivery failed (${res.status}). Check Vercel logs for details.` },
        { status: 500 }
      );
    }

    console.log("[contact] Email sent OK:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });

  } catch (e: any) {
    console.error("[contact] Network error:", e?.message);
    return NextResponse.json({ error: "Network error reaching Resend API." }, { status: 500 });
  }
}
