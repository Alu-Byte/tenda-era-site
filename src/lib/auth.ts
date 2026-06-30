import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";

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

function getPasswordHash(): string {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
      if (data.passwordHash) return data.passwordHash;
    } catch {}
  }
  const defaultPwd = process.env.ADMIN_PASSWORD;
  if (!defaultPwd) throw new Error("ADMIN_PASSWORD env var is not set.");
  const hash = bcrypt.hashSync(defaultPwd, 10);
  const dir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ passwordHash: hash }));
  return hash;
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

export function validatePassword(password: string): boolean {
  return bcrypt.compareSync(password, getPasswordHash());
}

export function changePassword(newPassword: string): void {
  const hash = bcrypt.hashSync(newPassword, 10);
  const dir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ passwordHash: hash }));
}
