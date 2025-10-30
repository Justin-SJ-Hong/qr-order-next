// src/lib/supabase/server.ts
// import { createClient } from "@supabase/supabase-js";
// import { cookies } from "next/headers";

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// // 쿠키에 저장된 access_token 사용 (로그인 시 세팅해두면 됨)
// export async function supabaseServer() {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("sb-access-token")?.value;

//   return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//     auth: {
//       persistSession: false,
//       autoRefreshToken: false,
//     },
//     ...(accessToken
//       ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
//       : {}),
//   });
// }
