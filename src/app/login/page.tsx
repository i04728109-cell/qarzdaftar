"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { normalizePhone } from "@/lib/money";
import { phoneToEmail } from "@/lib/auth";

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [mode, setMode] = useState<"login" | "register">("login");
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
        if (r.status === 409) return setMsg("Bu raqam allaqachon roʻyxatdan oʻtgan. Kirish tugmasini bosing.");
        if (!r.ok) {
          const j = await r.json().catch(() => null) as { error?: { code?: string } } | null;
          return setMsg(`Roʻyxatdan oʻtib boʻlmadi. Maʼlumotlarni tekshirib, qayta urining. (${j?.error?.code ?? r.status})`);
        }
      }
      await signIn(phone);
    } catch {
      setMsg("Xatolik. Internetni tekshirib, qayta urining.");
    } finally { setBusy(false); }
  }

  const input = "w-full rounded-xl border border-qd-line bg-qd-card px-3 py-3 outline-none focus:border-qd-emerald";
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-extrabold">Qarz<span className="text-qd-green">Daftar</span></h1>
      <p className="text-sm text-qd-mute">Qarz unutilmaydi. Munosabat buzilmaydi.</p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === "register" && (<>
          <input className={input} placeholder="Ism va familiya" value={f.name} onChange={set("name")} required minLength={2} />
          <input className={input} placeholder="Doʻkon nomi" value={f.store} onChange={set("store")} required minLength={2} />
        </>)}
        <input className={input} inputMode="tel" autoComplete="tel" placeholder="+998 90 123 45 67" value={f.phone} onChange={set("phone")} required />
        <input className={input} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Parol (kamida 8 belgi)" value={f.password} onChange={set("password")} required minLength={mode === "register" ? 8 : 1} />
        {msg && <p className="text-sm text-qd-amber">{msg}</p>}
        <button disabled={busy} className="rounded-xl bg-qd-emerald py-3 font-bold text-[#031a10] disabled:opacity-50">
          {busy ? "..." : mode === "login" ? "Kirish" : "Roʻyxatdan oʻtish"}
        </button>
      </form>
      <button className="text-sm text-qd-mute" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg(null); }}>
        {mode === "login" ? "Hisobingiz yoʻqmi? Roʻyxatdan oʻting" : "Hisobingiz bormi? Kirish"}
      </button>
      <p className="text-center text-xs text-qd-mute">Parolni unutgan boʻlsangiz, administratorga murojaat qiling.</p>
    </main>
  );
}
