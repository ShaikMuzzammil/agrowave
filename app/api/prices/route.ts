import { NextResponse } from "next/server";
import { getLivePrices } from "@/lib/utils";
export async function GET() { return NextResponse.json(getLivePrices()); }
