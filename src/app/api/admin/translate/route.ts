import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ translated: "" });

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=sq&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const data = await res.json();
    const translated = (data[0] as [string][]).map((chunk) => chunk[0]).join("");
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
