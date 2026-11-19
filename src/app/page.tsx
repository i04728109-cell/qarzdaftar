import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

const APK_URL = "https://github.com/i04728109-cell/qarzdaftar/releases/download/android-build-61/qarzdaftar.apk";

const benefits = [
  ["01", "Mijozlar bazasi", "Mijozlarning ismi va aloqa maʼlumotlarini bitta joyda saqlang."],
  ["02", "Qarzlar nazorati", "Har bir qarz summasi va qolgan balansni alohida kuzating."],
  ["03", "Toʻlovlar tarixi", "Qisman va toʻliq toʻlovlarni qayd etib, oldingi yozuvlarni tekshiring."],
  ["04", "Hisobotlar", "Qarz va toʻlovlar holatini umumiy koʻrinishda kuzatib boring."],
];

const steps = [
  ["01", "Mijozni qoʻshing", "Ism va kerakli aloqa maʼlumotlarini kiriting."],
  ["02", "Qarz yoki toʻlovni yozing", "Summani tegishli mijoz hisobiga qayd eting."],
  ["03", "Hisob tarixini tekshiring", "Mijoz kartasidagi yozuvlar orqali hisob-kitobni kuzating."],
];

const audiences = [
  ["Mahalla doʻkoni", "Doimiy mijozlar va ularning qarz yozuvlarini tartibli saqlang."],
  ["Kichik savdo nuqtasi", "Qabul qilingan toʻlovlarni qayd etib, qolgan balansni kuzating."],
  ["Xizmat koʻrsatuvchi biznes", "Mijozlar boʻyicha hisob-kitob tarixini bir joyda yuriting."],
];

const questions = [
  ["QarzDaftar kimlar uchun?", "Mijozlar, qarzlar va toʻlovlarni tartibli yuritishni istagan doʻkonlar va kichik bizneslar uchun."],
  ["Telefonda ishlaydimi?", "Ha, veb-sayt telefon va kompyuter ekranlariga moslashadi."],
  ["Android APK tayyormi?", "Ha, Android APK tayyor. Uni ushbu sahifadagi rasmiy tugma orqali yuklab olishingiz mumkin."],
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    redirect(isAdmin === true ? "/admin" : "/app");
  }

  return <MarketingFrame>
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_18%,rgba(26,143,82,.18),transparent_42%),linear-gradient(120deg,#06170e,#071c12_55%,#04100a)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#286b46] bg-[#0c2b1b] px-4 py-2 text-xs font-semibold text-[#a8f0c5]"><span className="h-2 w-2 rounded-full bg-[#42e38e]" /> Kundalik hisob-kitoblar uchun raqamli yordamchi</div>
          <h1 className="mt-7 text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[60px]">Qarzlarni tartibli yozing. <span className="text-[#4be092]">Hisobingizni</span> ishonch bilan boshqaring.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#a6bcae] sm:text-lg">QarzDaftar — doʻkon va kichik bizneslar uchun mijozlar, qarzlar va toʻlovlarni bir joyda yuritishga yordam beradigan sodda xizmat.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/login?next=/app" className="inline-flex items-center justify-center rounded-xl bg-[#39dc8b] px-6 py-4 font-extrabold text-[#052014] transition hover:bg-[#68eaa8]">Bepul boshlash <span className="ml-2">→</span></Link>
            <a href={APK_URL} download="qarzdaftar.apk" className="inline-flex items-center justify-center rounded-xl border border-[#4be092]/50 bg-[#123b25] px-6 py-4 font-bold text-[#c9f7da] transition hover:bg-[#195334]">↓ Android APK yuklab olish</a>
            <Link href="/how-it-works" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-bold text-white transition hover:bg-white/10">Qanday ishlaydi?</Link>
          </div>
          <p className="mt-3 text-xs text-[#91aa9a]">Android uchun rasmiy APK · 4,1 MB</p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#9ab3a3]"><span>✓ Telefon va kompyuterda</span><span>✓ Oʻzbek tilida</span><span>✓ Mijozlar boʻyicha hisob</span></div>
        </div>
        <aside className="w-full rounded-3xl border border-[#285d3d] bg-[#0c2115] p-6 shadow-2xl shadow-black/20 sm:p-8" aria-label="QarzDaftar imkoniyatlari">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#63e6a0]">QarzDaftar qanday yordam beradi?</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">Barcha hisob-kitob bir joyda</h2>
          <p className="mt-3 text-sm leading-7 text-[#a6bcae]">Kundalik ish uchun uchta asosiy boʻlim:</p>
          <div className="mt-6 space-y-3">
            {[[ "01","Mijozlar","Ism va aloqa maʼlumotlari"],["02","Qarzlar","Berilgan summa va qoldiq"],["03","Toʻlovlar","Qaytarilgan pullar tarixi"]].map(([n,t,d])=><div key={n} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#10291b] p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1a4a2d] text-sm font-black text-[#71e9a7]">{n}</span><div><p className="font-bold text-white">{t}</p><p className="mt-1 text-xs text-[#91aa9a]">{d}</p></div><span className="ml-auto text-[#62df98]">✓</span></div>)}
          </div>
          <div className="mt-6 rounded-2xl bg-[#143b24] p-4"><p className="text-sm font-bold text-[#c8f7d9]">Oddiy tartib. Aniq hisob.</p><p className="mt-1 text-xs leading-6 text-[#9ebba8]">Yozuvlarni mijozlar kesimida saqlang va kerakli maʼlumotni oson toping.</p></div>
        </aside>
      </div>
    </section>

    <section className="border-b border-white/10 bg-[#081a10]"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 lg:px-8">{[["Tartib", "Mijozlar va yozuvlar bir joyda"],["Nazorat", "Qarz va toʻlovlar tarixi"],["Qulaylik", "Telefon yoki kompyuterdan foydalanish"]].map(([title,desc])=><div key={title} className="flex items-start gap-3"><span className="mt-1 text-xl font-black text-[#4be092]">✓</span><div><p className="font-extrabold text-white">{title}</p><p className="mt-1 text-sm leading-6 text-[#91aa9a]">{desc}</p></div></div>)}</div></section>

    <section id="imkoniyatlar" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8"><SectionHeading eyebrow="Imkoniyatlar" title="Hisob-kitob uchun kerakli vositalar" text="Mijozlar, qarzlar va toʻlovlar haqidagi maʼlumotlarni alohida joylardan qidirmasdan, yagona tizimda tartibli yuriting." /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(([n,title,desc])=><article key={n} className="rounded-2xl border border-white/10 bg-[#0b2014] p-6"><p className="text-sm font-black tracking-widest text-[#43df91]">{n}</p><h3 className="mt-4 text-lg font-extrabold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-[#98b0a0]">{desc}</p></article>)}</div><div className="mt-8"><Link href="/features" className="text-sm font-bold text-[#55e49b] hover:underline">Barcha imkoniyatlar →</Link></div></section>

    <section id="qanday-ishlaydi" className="border-y border-white/10 bg-[#081a10] py-16 sm:py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionHeading eyebrow="Qanday ishlaydi?" title="Uchta oddiy qadamda boshlang" text="Hisob-kitobni yuritish uchun quyidagi ketma-ketlikdan foydalaning." /><div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map(([n,title,desc])=><article key={n} className="rounded-2xl border border-white/10 bg-[#0b2014] p-6 sm:p-7"><p className="text-sm font-black tracking-widest text-[#48df95]">{n}</p><h3 className="mt-4 text-lg font-extrabold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-[#9eb5a6]">{desc}</p></article>)}</div><Link href="/how-it-works" className="mt-8 inline-flex font-bold text-[#55e49b] hover:underline">Batafsil yoʻriqnoma →</Link></div></section>

    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8"><SectionHeading eyebrow="Kimlar uchun?" title="Kichik biznesning kundalik ishlari uchun" text="Mijozlar bilan muntazam hisob-kitob qiladigan turli savdo va xizmat koʻrsatish nuqtalariga mos." /><div className="mt-10 grid gap-5 md:grid-cols-3">{audiences.map(([title,desc],i)=><article key={title} className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#10281a] to-[#09170f] p-7"><p className="text-xs font-bold text-[#4be092]">0{i+1} / QOʻLLANISH</p><h3 className="mt-4 text-xl font-extrabold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-[#9eb5a6]">{desc}</p></article>)}</div></section>

    <section id="android" className="border-y border-white/10 bg-[#081a10] py-16 sm:py-20"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-[1fr_auto] lg:px-8"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#68e9a3]">Android ilova</p><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">QarzDaftar telefoningizda</h2><p className="mt-4 text-sm leading-7 text-[#b0c8b8]">Android ilovasining rasmiy APK fayli tayyor. Uni yuklab olib, Android telefoningizga oʻrnating.</p></div><a href={APK_URL} download="qarzdaftar.apk" className="inline-flex items-center justify-center rounded-xl bg-[#39dc8b] px-6 py-4 font-extrabold text-[#052014] transition hover:bg-[#68eaa8]">↓ APK yuklab olish</a></div></section>

    <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20"><SectionHeading eyebrow="Savol-javob" title="Koʻp soʻraladigan savollar" text="QarzDaftardan foydalanish haqida qisqa javoblar." /><div className="mt-8 space-y-3">{questions.map(([q,a])=><details key={q} className="rounded-2xl border border-white/10 bg-[#0b2014] p-5"><summary className="cursor-pointer font-bold text-white">{q}</summary><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">{a}</p></details>)}</div><Link href="/faq" className="mt-6 inline-flex font-bold text-[#55e49b] hover:underline">Barcha savol-javoblar →</Link></section>

    <section className="px-5 pb-16 sm:pb-20"><div className="mx-auto max-w-5xl rounded-3xl border border-[#286b46] bg-gradient-to-br from-[#123d25] to-[#0a1a10] px-6 py-12 text-center sm:px-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#68e9a3]">Boshlash vaqti</p><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Hisob-kitoblaringizni tartibga soling</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#a2b9aa]">QarzDaftar hisobini yarating va mijozlaringiz bilan ishlashni qulayroq qiling.</p><Link href="/login?next=/app" className="mt-7 inline-flex rounded-xl bg-[#3cde8e] px-7 py-3.5 font-extrabold text-[#062014] transition hover:bg-[#68eaa8]">Roʻyxatdan oʻtish →</Link></div></section>
  </MarketingFrame>;
}
