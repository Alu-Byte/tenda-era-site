import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import { readFresh, updateOpeningHours, updateAnnouncement } from "@/lib/data";

const DEFAULT_HOURS = {
  weekdays_sq: "E Hënë – E Premte, 8:00 – 18:00",
  weekdays_en: "Monday – Friday, 8:00 AM – 6:00 PM",
  saturday_sq: "E Shtunë, 8:00 – 14:00",
  saturday_en: "Saturday, 8:00 AM – 2:00 PM",
};
const DEFAULT_ANN = { text_sq: "", text_en: "", active: false, bg: "red" as const };

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await readFresh();
    return NextResponse.json({
      openingHours: data.openingHours ?? DEFAULT_HOURS,
      announcement: data.announcement ?? DEFAULT_ANN,
    });
  } catch (err) {
    console.error("[site GET]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (body.type === "hours") {
      const { type: _t, ...updates } = body;
      void _t;
      await updateOpeningHours(updates);
    } else if (body.type === "announcement") {
      const { type: _t, ...updates } = body;
      void _t;
      await updateAnnouncement(updates);
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[site PATCH]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
