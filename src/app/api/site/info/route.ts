import { NextResponse } from "next/server";
import { getOpeningHours, getAnnouncement } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    openingHours: getOpeningHours(),
    announcement: getAnnouncement(),
  });
}
