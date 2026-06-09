import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success:true, reportId:Date.now().toString(), summary:{ plots:6, avgHealth:82, week:"Kharif 2026 W47" }, ...body });
}
