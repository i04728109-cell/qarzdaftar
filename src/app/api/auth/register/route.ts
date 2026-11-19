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

// POST /api/auth/register  (public). Creates auth user + profile phone + store in one step, rolls back on any failure.
// NOTE: the phone number is NOT verified by SMS in this mode. Enable SMS verification before real public launch.
export async function POST(req: Request) {
  try {
    const i = schema.parse(await req.json().catch(() => null));
    const db = createServiceClient();

    const created = await db.auth.admin.createUser({
      email: phoneToEmail(i.phone), password: i.password, email_confirm: true,
      user_metadata: { full_name: i.full_name, phone: i.phone },
    });
    if (created.error || !created.data.user) {
      const code = (created.error as { code?: string } | null)?.code;
      if (code === "email_exists" || created.error?.status === 422) return fail(409, "phone_taken", "Bu raqam allaqachon roʻyxatdan oʻtgan");
      throw created.error ?? new Error("createUser failed");
    }
    const uid = created.data.user.id;

    const prof = await db.from("profiles").update({ phone: i.phone, full_name: i.full_name }).eq("id", uid);
    if (prof.error) { await db.auth.admin.deleteUser(uid); throw prof.error; }

    const store = await db.from("stores").insert({ owner_id: uid, name: i.store_name });
    if (store.error) { await db.auth.admin.deleteUser(uid); throw store.error; }

    return NextResponse.json({ data: { ok: true } }, { status: 201 });
  } catch (e) {
    return toResponse(e);
  }
}
