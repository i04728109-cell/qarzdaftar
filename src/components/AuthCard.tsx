"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { normalizePhone } from "@/lib/money";
import { phoneToEmail } from "@/lib/auth";

/** Login / registration card used inside the public home page. */
export function AuthCard({ initial = "register" }: { initial?: "login" | "register" }) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [mode, setMode] = useState<"login" | "register">(initial);
  const [f, setF] = useState({ phone: "+998", password: "", name: "", store: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function signIn(phone: string) {
    const sb = createClient();
    const { error } = await sb.auth.signInWithPassword({ email: phoneToEmail(phone), password: f.password });
    if (error) return setMsg("Telefon yoki parol notoʻgʻri");
    const { data: isAdmin } = await sb.rpc("is_admin");
    router.replace(next ?? (isAdmin === true ? "/admin" : "/app"));
    router.refresh();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setBusy(true);
    try {
      const phone = normalizePhone(f.phone);
      if (!phone) return setMsg("Telefon raqami notoʻgʻri (+998 XX XXX XX XX)");
      if (mode === "register") {
        if (f.password.length < 8) return setMsg("Parol kamida 8 belgidan iborat boʻlsin");
        const r = await fetch("/api/auth/register", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ phone, password: f.password, full_name: f.name, store_name: f.store }),
        });
        if (r.status === 409) return setMsg("Bu raqam allaqachon roʻyxatdan oʻtgan. «Kirish» ni bosing.");
        if (!r.ok) {
          const j = await r.json().catch(() => null) as { error?: { code?: string; message?: string } } | null;
          return setMsg(j?.error?.message ?? `Roʻyxatdan oʻtib boʻlmadi. Xatolik kodi: ${j?.error?.code ?? r.status}`);
        }
      }
      await signIn(phone);
    } catch {
      setMsg("Xatolik. Internetni tekshirib, qayta urining.");
    } finally { setBusy(false); }
  }

  const input = "w-full rounded-xl border border-qd-line bg-qd-card px-3 py-3 outline-none focus:border-qd-emerald";
  const tab = (on: boolean) => `flex-1 rounded-lg py-2 text-sm font-semibold ${on ? "bg-qd-emerald text-[#031a10]" : "text-qd-mute"}`;
  return (
    <div className="rounded-qd border border-qd-line bg-qd-card2 p-4 shadow-glow">
      <div className="mb-4 flex gap-1 rounded-xl bg-qd-bg p-1">
        <button type="button" className={tab(mode === "register")} onClick={() => { setMode("register"); setMsg(null); }}>Roʻyxatdan oʻtish</button>
        <button type="button" className={tab(mode === "login")} onClick={() => { setMode("login"); setMsg(null); }}>Kirish</button>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === "register" && (<>
          <input className={input} placeholder="Ism va familiya" value={f.name} onChange={set("name")} required minLength={2} autoComplete="name" />
          <input className={input} placeholder="Doʻkon nomi" value={f.store} onChange={set("store")} required minLength={2} />
        </>)}
        <input className={input} inputMode="tel" autoComplete="tel" placeholder="+998 90 123 45 67" value={f.phone} onChange={set("phone")} required />
        <input className={input} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Parol (kamida 8 belgi)" value={f.password} onChange={set("password")} required minLength={mode === "register" ? 8 : 1} />
        {msg && <p className="text-sm text-qd-amber">{msg}</p>}
        <button disabled={busy} className="rounded-xl bg-qd-emerald py-3 font-bold text-[#031a10] disabled:opacity-50">
          {busy ? "..." : mode === "login" ? "Kirish" : "Roʻyxatdan oʻtish"}
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-qd-mute">Parolni unutgan boʻlsangiz, administratorga murojaat qiling.</p>
    </div>
  );
}
