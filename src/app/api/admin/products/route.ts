import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import {
  readDataAsync,
  addSubcategory, updateSubcategory, deleteSubcategory, updateCategory,
} from "@/lib/data";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await readDataAsync();
    return NextResponse.json({
      categories: [...data.categories].sort((a, b) => a.order - b.order),
      subcategories: [...data.subcategories].sort((a, b) => a.order - b.order),
    });
  } catch (err) {
    console.error("[products GET]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const sub = await req.json();
    await addSubcategory(sub);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[products POST]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, type, ...updates } = await req.json();
    if (type === "category") {
      await updateCategory(id, updates);
    } else {
      await updateSubcategory(id, updates);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[products PATCH]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await deleteSubcategory(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[products DELETE]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
