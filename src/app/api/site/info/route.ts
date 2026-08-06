import { NextResponse } from "next/server";
import { readFresh } from "@/lib/data";

export const dynamic = "force-dynamic";

const DEFAULT_HOURS = {
  weekdays_sq: "E Hënë – E Premte, 8:00 – 16:00",
  weekdays_en: "Monday – Friday, 8:00 AM – 4:00 PM",
  saturday_sq: "E Shtunë, 8:00 – 14:00",
  saturday_en: "Saturday, 8:00 AM – 2:00 PM",
};
const DEFAULT_ANN = { text_sq: "", text_en: "", active: false, bg: "red" as const };

export async function GET() {
  try {
    const data = await readFresh();
    return NextResponse.json({
      openingHours: data.openingHours ?? DEFAULT_HOURS,
      announcement: data.announcement ?? DEFAULT_ANN,
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err) {
    console.error("[site/info GET]", err);
    return NextResponse.json({
      openingHours: DEFAULT_HOURS,
      announcement: DEFAULT_ANN,
    });
  }
}
