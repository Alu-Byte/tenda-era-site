import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, validatePassword, changePassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authed = await checkAdminAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!(await validatePassword(currentPassword))) {
      return NextResponse.json({ error: "Fjalëkalimi aktual është i gabuar." }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere." }, { status: 400 });
    }

    await changePassword(newPassword);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[password POST]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
