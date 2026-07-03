import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import { readDataAsync, addFaq, updateFaq, deleteFaq } from "@/lib/data";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await readDataAsync();
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
    const faq = await req.json();
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
    const { id } = await req.json();
    await deleteFaq(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[faq DELETE]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
