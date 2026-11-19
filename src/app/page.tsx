import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const features = [
  { icon: "👥", title: "Mijozlar bir joyda", text: "Mijozlar roʻyxati va har bir mijoz bilan hisob-kitoblar tartibli saqlanadi." },
  { icon: "📒", title: "Qarzlar nazoratda", text: "Kim qancha qarzdor yoki qancha toʻlaganini tezda koʻring." },
  { icon: "📊", title: "Aniq hisobotlar", text: "Savdo va toʻlovlar holatini tushunarli statistikada kuzating." },
  { icon: "📱", title: "Telefon va kompyuterda", text: "Bir hisob orqali sayt va Android ilovadan foydalaning." },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    redirect(isAdmin === true ? "/admin" : "/app");
  }

  return (
    <main className="min-h-dvh overflow-hidden">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight">Qarz<span className="text-qd-green">Daftar</span></Link>
        <Link href="/login?next=/app" className="rounded-xl border border-qd-line px-4 py-2.5 text-sm font-semibold transition hover:border-qd-green">Kirish</Link>
      </header>

      <section className="relative mx-auto grid min-h-[590px] w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-qd-line bg-qd-card px-3 py-1.5 text-xs font-semibold text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Hisob-kitoblar uchun sodda yechim
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Qarzlaringizni <span className="text-emerald-400">unutmang.</span><br />Ishingizni oson boshqaring.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-qd-mute sm:text-lg">
            QarzDaftar — mijozlar, qarzlar va toʻlovlarni bitta joyda yuritish uchun qulay xizmat. Telefoningizdan ham, kompyuteringizdan ham foydalaning.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="https://github.com/i04728109-cell/qarzdaftar/releases/latest/download/qarzdaftar.apk" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-[#04100c] shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300">
              <span>⬇</span> Android ilovani yuklab olish
            </a>
            <Link href="/login?next=/app" className="inline-flex items-center justify-center rounded-xl border border-qd-line bg-qd-card px-6 py-3.5 font-bold transition hover:border-emerald-400">
              Kirish / Roʻyxatdan oʻtish
            </Link>
          </div>
          <p className="mt-3 text-xs text-qd-mute">Android APK · Internet orqali sinxron ishlaydi</p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-8 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-emerald-900 bg-gradient-to-br from-[#123d26] to-[#08170f] p-5 shadow-2xl shadow-black/40 sm:p-7">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-emerald-200/70">QARZDAFTAR</p><h2 className="mt-1 text-xl font-extrabold">Hisobingiz nazoratda</h2></div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-300/15 text-2xl">📗</div>
            </div>
            <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-emerald-100/70">Jami qarzlar</p>
              <p className="mt-2 text-3xl font-black">12 450 000 <span className="text-sm font-semibold text-emerald-100/70">soʻm</span></p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-emerald-400" /></div>
              <div className="mt-2 flex justify-between text-xs text-emerald-100/60"><span>Toʻlovlar nazorati</span><span>Oson va aniq</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xl">👥</span><p className="mt-3 text-2xl font-bold">Mijozlar</p><p className="mt-1 text-xs text-emerald-100/60">Barcha kontaktlar</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xl">💳</span><p className="mt-3 text-2xl font-bold">Toʻlovlar</p><p className="mt-1 text-xs text-emerald-100/60">Har bir operatsiya</p></div>
            </div>
            <p className="mt-5 text-center text-xs text-emerald-100/50">Qarz unutilmaydi. Munosabat buzilmaydi.</p>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-qd-line bg-[#07170f]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Imkoniyatlar</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Hisob-kitoblar endi ancha oson</h2><p className="mt-3 leading-7 text-qd-mute">Kundalik ishlaringizni tartibga solish uchun kerakli vositalar bir joyda.</p></div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => <article key={item.title} className="rounded-2xl border border-qd-line bg-qd-card p-5"><div className="text-3xl">{item.icon}</div><h3 className="mt-4 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-qd-mute">{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight">QarzDaftar bilan boshlang</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-qd-mute">Hisobingizga kiring yoki yangi hisob yarating. Keyin Android ilovasida ham shu hisobdan foydalanishingiz mumkin.</p>
        <Link href="/login?next=/app" className="mt-7 inline-flex rounded-xl bg-emerald-400 px-7 py-3.5 font-bold text-[#04100c] transition hover:bg-emerald-300">Boshlash</Link>
      </section>

      <footer className="border-t border-qd-line px-5 py-6 text-center text-xs text-qd-mute">© {new Date().getFullYear()} QarzDaftar. Barcha huquqlar himoyalangan.</footer>
    </main>
  );
}
