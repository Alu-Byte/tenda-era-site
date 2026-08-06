import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import {
  readFresh,
  addSubcategory, updateSubcategory, deleteSubcategory, updateCategory,
} from "@/lib/data";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await readFresh();
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
    const body = await req.json();
    // Strip routing-only fields so they don't get persisted as record fields.
    const { type: _t, ...raw } = body;
    void _t;
    // Validate the required shape before writing anything. A missing id would
    // otherwise persist a subcategory record with no id and no order.
    const required = ["id", "categoryId", "name_sq", "name_en"] as const;
    for (const k of required) {
      if (typeof raw[k] !== "string" || !raw[k].trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${k}` },
          { status: 400 }
        );
      }
    }
    const sub = {
      id: raw.id,
      categoryId: raw.categoryId,
      name_sq: raw.name_sq,
      name_en: raw.name_en,
      desc_sq: typeof raw.desc_sq === "string" ? raw.desc_sq : "",
      desc_en: typeof raw.desc_en === "string" ? raw.desc_en : "",
      order: typeof raw.order === "number" ? raw.order : 0,
      ...(typeof raw.modelUrl === "string" ? { modelUrl: raw.modelUrl } : {}),
    };
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
    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }
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
    // Accept id in JSON body (existing client) or ?id=... query param.
    let id: unknown = new URL(req.url).searchParams.get("id");
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch { /* no body — fall through to 400 */ }
    }
    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }
    await deleteSubcategory(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[products DELETE]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
