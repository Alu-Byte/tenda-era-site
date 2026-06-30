import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import { getOpeningHours, getAnnouncement, updateOpeningHours, updateAnnouncement } from "@/lib/data";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ openingHours: getOpeningHours(), announcement: getAnnouncement() });
}

export async function PATCH(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.type === "hours") {
    const { type: _t, ...updates } = body;
    updateOpeningHours(updates);
  } else if (body.type === "announcement") {
    const { type: _t, ...updates } = body;
    updateAnnouncement(updates);
  } else {
    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
