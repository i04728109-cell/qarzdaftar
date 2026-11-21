"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { formatUZS } from "@/lib/money";
import { SiteStyleSwitcher } from "@/components/SiteStyleSwitcher";

type Plan = { id: string; name: string; duration_months: number; price_uzs: number };
type Sub = { id: string; status: string; created_at: string };

/** Shown instead of the app until the store has an active subscription. */
export function Paywall({ storeName }: { storeName: string }) {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [planId, setPlanId] = useState<string | null>(null);
  const [ref, setRef] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch("/api/subscriptions");
    if (!r.ok) return;
    const j = await r.json() as { data: { plans: Plan[]; subscriptions: Sub[] } };
    setPlans(j.data.plans); setSubs(j.data.subscriptions);
    setPlanId((p) => p ?? j.data.plans[0]?.id ?? null);
  }
  useEffect(() => { void load(); }, []);

  const pending = subs.some((s) => s.status === "pending");

  async function request(e: React.FormEvent) {
    e.preventDefault(); if (!planId) return;
    setBusy(true); setMsg(null);
    const r = await fetch("/api/subscriptions", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan_id: planId, reference: ref || undefined }),
    });
    setBusy(false);
    if (r.ok) { setMsg("Soʻrov yuborildi. Admin toʻlovni tekshirgach, ilova ochiladi."); setRef(""); await load(); router.refresh(); }
    else setMsg("Soʻrov yuborilmadi. Birozdan soʻng qayta urining.");
  }
  async function logout() { await createClient().auth.signOut(); router.replace("/"); router.refresh(); }

  return (
    <main className="client-theme mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-8" data-theme="yashil">
      <header className="flex items-center justify-between"><SiteStyleSwitcher />
        <h1 className="text-2xl font-extrabold">Qarz<span className="text-qd-green">Daftar</span></h1>
        <button onClick={logout} className="text-sm text-qd-mute">Chiqish</button>
      </header>
      <section className="rounded-qd border border-qd-line bg-qd-card p-4">
        <p className="text-sm text-qd-mute">Doʻkon</p>
        <p className="text-lg font-bold">{storeName}</p>
        <p className="mt-2 text-sm text-qd-amber">Ilovadan foydalanish uchun obuna sotib oling.</p>
      </section>
      {pending ? (
        <section className="rounded-qd border border-qd-line bg-qd-card p-4 text-sm">
          <p className="font-semibold text-qd-green">Soʻrovingiz tekshirilmoqda</p>
          <p className="mt-1 text-qd-mute">Admin toʻlovni tasdiqlagach, ilova avtomatik ochiladi. Sahifani yangilang.</p>
          <button onClick={() => router.refresh()} className="mt-3 w-full rounded-xl border border-qd-line py-2">Yangilash</button>
        </section>
      ) : (
        <form onSubmit={request} className="flex flex-col gap-3">
          {plans.map((p) => (
            <label key={p.id} className={`flex cursor-pointer items-center justify-between rounded-qd border p-4 ${planId === p.id ? "border-qd-emerald bg-qd-card2" : "border-qd-line bg-qd-card"}`}>
              <span><input type="radio" name="plan" className="mr-2" checked={planId === p.id} onChange={() => setPlanId(p.id)} />{p.name}</span>
              <span className="font-bold">{formatUZS(p.price_uzs)}</span>
            </label>
          ))}
          <input className="w-full rounded-xl border border-qd-line bg-qd-card px-3 py-3" placeholder="Toʻlov izohi / chek raqami (ixtiyoriy)" value={ref} onChange={(e) => setRef(e.target.value)} maxLength={200} />
          <button disabled={busy || !planId} className="rounded-xl bg-qd-emerald py-3 font-bold text-[#031a10] disabled:opacity-50">{busy ? "..." : "Obunani soʻrash"}</button>
        </form>
      )}
      {msg && <p className="text-sm text-qd-amber">{msg}</p>}
    </main>
  );
}
