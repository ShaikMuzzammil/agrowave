import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { commodity, alertType, threshold, email } = body;

  if (!commodity || !alertType || !threshold) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // In production: store in DB and send via email/SMS
  console.log("Price alert set:", { commodity, alertType, threshold, email });

  return NextResponse.json({
    success: true,
    alert: { commodity, type: alertType, threshold, email, id: Date.now().toString() }
  });
}
