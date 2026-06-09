import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, farmData } = body;

  // In production: generate PDF report and email it
  const report = {
    id: Date.now().toString(),
    generatedAt: new Date().toISOString(),
    email,
    summary: {
      totalPlots: farmData?.plots || 6,
      avgHealth: farmData?.health || 82,
      irrigationEvents: farmData?.irrigation || 12,
      alertsResolved: 5,
      weeklyYieldEstimate: "284 qtl",
      estimatedRevenue: "₹5,42,000",
    },
    message: email ? `Weekly report queued for ${email}` : "Report generated (add email to receive it)"
  };

  return NextResponse.json({ success: true, report });
}
