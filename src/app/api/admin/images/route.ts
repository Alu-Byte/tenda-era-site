import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { checkAdminAuth } from "@/lib/auth";
import { readData, updateImage, deleteImage } from "@/lib/data";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = readData();
  return NextResponse.json(data.images);
}

export async function PATCH(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...updates } = await req.json();
  updateImage(id, updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const filename = deleteImage(id);
  if (filename) {
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  }
  return NextResponse.json({ ok: true });
}
