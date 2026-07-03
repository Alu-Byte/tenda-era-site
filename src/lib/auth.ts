import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { readDataAsync, writeData } from "@/lib/data";
import type { SiteData } from "@/types";

const AUTH_FILE = path.join(process.cwd(), "data", "auth.json");
export const SESSION_COOKIE = "te_admin_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET env var must be set in production.");
  }
  return secret || "dev-only-secret-change-in-prod";
}

export function createSessionToken(): string {
  return crypto.createHmac("sha256", getSecret()).update("te_admin").digest("hex");
}

/**
 * Password hash resolution order:
 *   1. site-data blob (persisted via writeData) — production path
 *   2. local auth.json — legacy dev path
 *   3. ADMIN_PASSWORD env var, hashed on-the-fly — bootstrap fallback
 */
async function getPasswordHash(): Promise<string> {
  // 1. Blob / site data
  try {
    const data = await readDataAsync();
    if ((data as SiteData & { adminHash?: string }).adminHash) {
      return (data as SiteData & { adminHash?: string }).adminHash!;
    }
  } catch { /* ignore */ }

  // 2. Local auth.json (dev only)
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
      if (data.passwordHash) return data.passwordHash;
    }
  } catch { /* ignore */ }

  // 3. ADMIN_PASSWORD env var
  const defaultPwd = process.env.ADMIN_PASSWORD;
  if (!defaultPwd) throw new Error("ADMIN_PASSWORD env var is not set.");
  return bcrypt.hashSync(defaultPwd, 10);
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(createSessionToken())
    );
  } catch {
    return false;
  }
}

export async function validatePassword(password: string): Promise<boolean> {
  const hash = await getPasswordHash();
  return bcrypt.compareSync(password, hash);
}

export async function changePassword(newPassword: string): Promise<void> {
  const hash = bcrypt.hashSync(newPassword, 10);

  // Prefer persistent storage (blob) on Vercel — falls back to local file in dev.
  const data = (await readDataAsync()) as SiteData & { adminHash?: string };
  data.adminHash = hash;
  await writeData(data);

  // Also keep the local file up-to-date if the fs is writable (dev).
  try {
    const dir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ passwordHash: hash }));
  } catch { /* read-only fs on Vercel — safe to ignore, blob has it */ }
}
