import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import { readFresh, addFaq, updateFaq, deleteFaq } from "@/lib/data";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await readFresh();
    return NextResponse.json([...data.faqs].sort((a, b) => a.order - b.order));
  } catch (err) {
    console.error("[faq GET]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const raw = await req.json();
    if (typeof raw?.id !== "string" || !raw.id.trim()) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }
    const faq = {
      id: raw.id,
      q_sq: typeof raw.q_sq === "string" ? raw.q_sq : "",
      a_sq: typeof raw.a_sq === "string" ? raw.a_sq : "",
      q_en: typeof raw.q_en === "string" ? raw.q_en : "",
      a_en: typeof raw.a_en === "string" ? raw.a_en : "",
      order: typeof raw.order === "number" ? raw.order : 0,
    };
    await addFaq(faq);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[faq POST]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, ...updates } = await req.json();
    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }
    await updateFaq(id, updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[faq PATCH]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    let id: unknown = new URL(req.url).searchParams.get("id");
    if (!id) {
      try { id = (await req.json())?.id; } catch { /* fall through */ }
    }
    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }
    await deleteFaq(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[faq DELETE]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
