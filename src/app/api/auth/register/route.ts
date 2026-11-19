import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, toResponse } from "@/lib/api";
import { phoneToEmail } from "@/lib/auth";
import { phone } from "@/lib/schemas";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const schema = z.object({
  phone,
  password: z.string().min(8).max(72),
  full_name: z.string().trim().min(2).max(120),
  store_name: z.string().trim().min(2).max(120),
});

export async function POST(req: Request) {
  let userId: string | null = null;
  let db: ReturnType<typeof createServiceClient> | null = null;
  try {
    const input = schema.parse(await req.json().catch(() => null));
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return fail(500, "server_not_configured", "Supabase server environment is incomplete. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.");
    }
    db = createServiceClient();
    const created = await db.auth.admin.createUser({
      email: phoneToEmail(input.phone),
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.full_name, phone: input.phone },
    });
    if (created.error || !created.data.user) {
      const err = created.error as ({ code?: string; message?: string; status?: number } | null);
      if (err?.code === "email_exists" || /already been registered|already exists/i.test(err?.message ?? "")) {
        return fail(409, "phone_taken", "Bu telefon raqami allaqachon roʻyxatdan oʻtgan. Kirish boʻlimidan foydalaning.");
      }
      console.error("[register] create auth user failed", created.error);
      return fail(400, "account_create_failed", "Hisob yaratilmadi. Telefon raqami va parolni tekshiring.");
    }
    userId = created.data.user.id;

    // Upsert also repairs installations where the auth->profile trigger was not installed.
    const profile = await db.from("profiles").upsert({
      id: userId,
      phone: input.phone,
      full_name: input.full_name,
    }, { onConflict: "id" });
    if (profile.error) {
      if (profile.error.code === "23505") {
        await db.auth.admin.deleteUser(userId);
        userId = null;
        return fail(409, "phone_taken", "Bu telefon raqami allaqachon roʻyxatdan oʻtgan.");
      }
      throw profile.error;
    }

    const store = await db.from("stores").insert({ owner_id: userId, name: input.store_name });
    if (store.error) throw store.error;

    return NextResponse.json({ data: { ok: true } }, { status: 201 });
  } catch (e) {
    if (userId && db) {
      const cleanup = await db.auth.admin.deleteUser(userId);
      if (cleanup.error) console.error("[register] rollback failed", cleanup.error);
    }
    const x = e as { message?: string; code?: string };
    if (x?.code === "42P01" || x?.code === "PGRST205" || x?.code === "PGRST204") {
      return fail(500, "database_not_ready", "Database tables are missing. Run supabase/ALL_IN_ONE.sql in Supabase SQL Editor.");
    }
    if (x?.message && /invalid api key|jwt|apikey/i.test(x.message)) {
      return fail(500, "bad_supabase_keys", "Supabase keys in Vercel environment are invalid.");
    }
    return toResponse(e);
  }
}
