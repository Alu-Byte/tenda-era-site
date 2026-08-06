import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { checkAdminAuth } from "@/lib/auth";
import { readFresh, updateImage, deleteImage } from "@/lib/data";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await readFresh();
    return NextResponse.json(data.images);
  } catch (err) {
    console.error("[images GET]", err);
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
    await updateImage(id, updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[images PATCH]", err);
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
    // Snapshot the image record (with url) before we delete it so we know
    // whether it lives on Blob or the local filesystem.
    const data = await readFresh();
    const img = data.images.find((i) => i.id === id);
    const filename = await deleteImage(id);
    let orphaned = false;
    if (img?.url?.startsWith("https://")) {
      // Remote (Cloudinary) URL — remove from Cloudinary
      try {
        await deleteImageFromCloudinary(img.url);
      } catch (e) {
        console.error("[images DELETE] cloudinary del failed for", img.url, e);
        orphaned = true;
      }
    } else if (filename) {
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      if (existsSync(filePath)) {
        try { await unlink(filePath); } catch (e) { console.warn("[images DELETE] fs unlink failed", e); }
      }
    }
    return NextResponse.json({ ok: true, orphaned });
  } catch (err) {
    console.error("[images DELETE]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
