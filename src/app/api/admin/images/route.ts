import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { del as delBlob } from "@vercel/blob";
import { checkAdminAuth } from "@/lib/auth";
import { readDataAsync, updateImage, deleteImage } from "@/lib/data";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await readDataAsync();
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
    const { id } = await req.json();
    // Snapshot the image record (with url) before we delete it so we know
    // whether it lives on Blob or the local filesystem.
    const data = await readDataAsync();
    const img = data.images.find((i) => i.id === id);
    const filename = await deleteImage(id);
    if (img?.url?.startsWith("https://")) {
      // Vercel Blob URL — remove from Blob
      try { await delBlob(img.url); } catch (e) { console.warn("[images] blob del failed", e); }
    } else if (filename) {
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      if (existsSync(filePath)) {
        try { await unlink(filePath); } catch (e) { console.warn("[images] fs unlink failed", e); }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[images DELETE]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
