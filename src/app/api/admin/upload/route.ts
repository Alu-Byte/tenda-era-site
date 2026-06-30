import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { checkAdminAuth } from "@/lib/auth";
import { addImage } from "@/lib/data";
import type { SiteImage } from "@/types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const section = (form.get("section") as string) || "portfolio";
  const title = (form.get("title") as string) || "";
  const description = (form.get("description") as string) || "";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Max 10 MB." }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) {
    return NextResponse.json({ error: "Invalid file extension." }, { status: 400 });
  }
  const id = uuid();
  const filename = `${id}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  const image: SiteImage = {
    id,
    filename,
    originalName: file.name,
    url: `/uploads/${filename}`,
    section,
    title,
    description,
    order: Date.now(),
    visible: true,
    uploadedAt: new Date().toISOString(),
  };

  addImage(image);
  return NextResponse.json({ ok: true, image });
}
