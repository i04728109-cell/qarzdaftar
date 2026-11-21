import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const theme = body?.theme;
  if (theme !== "dark" && theme !== "bright") return NextResponse.json({ error: "invalid_theme" }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { error } = await supabase.from("profiles").update({ theme }).eq("id", user.id);
  if (error) return NextResponse.json({ error: "theme_save_failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
