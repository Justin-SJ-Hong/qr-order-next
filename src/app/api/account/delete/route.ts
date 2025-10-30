import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    // 클라이언트 세션에서 현재 유저 ID 가져오기 위해 일시적으로 anon client 사용하여 user fetch
    // 주의: 실제 운영에서는 쿠키에서 토큰을 읽거나 별도 인증 미들웨어 권장
    const anon = createClient(
      SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const {
      data: { user },
      error: userErr,
    } = await anon.auth.getUser();
    if (userErr) return NextResponse.json(userErr.message, { status: 401 });
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });

    // 서비스 롤로 auth.users 삭제
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
    if (delErr) return NextResponse.json(delErr.message, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const error = e as Error;
    return NextResponse.json(error.message || "Internal error", { status: 500 });
  }
}
