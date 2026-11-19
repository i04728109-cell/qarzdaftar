import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";
import MarketingPhoto from "@/components/MarketingPhoto";

const benefits = [
  ["01", "Mijozlar bazasi", "Mijozlaringiz haqidagi maʼlumotlarni bitta joyda saqlang. Kerakli odamni qidiruv orqali tez toping."],
  ["02", "Qarzlar tarixi", "Har bir qarz, qaytarilgan summa va qolgan balansni alohida kuzating."],
  ["03", "Toʻlovlar nazorati", "Qisman yoki toʻliq toʻlovlarni qayd eting va hisob-kitob tarixini yoʻqotmang."],
  ["04", "Hisobotlar", "Umumiy holatni tushunish uchun qarz va toʻlovlar boʻyicha jamlanmalarni koʻring."],
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    redirect(isAdmin === true ? "/admin" : "/app");
  }
  return <MarketingFrame>
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_15%,rgba(26,143,82,.22),transparent_45%),linear-gradient(120deg,#06170e,#071c12_55%,#04100a)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-1 lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#286b46] bg-[#0c2b1b] px-4 py-2 text-xs font-semibold text-[#a8f0c5]"><span className="h-2 w-2 rounded-full bg-[#42e38e]" /> Kundalik hisob-kitoblar uchun raqamli yordamchi</div>
          <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[62px]">Qarzlarni yozib boring. <span className="text-[#4be092]">Ishingizni ishonch bilan</span> boshqaring.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#a6bcae] sm:text-lg">QarzDaftar — doʻkon va kichik bizneslar uchun mijozlar, qarzlar va toʻlovlarni tartibli yuritishga yordam beradigan xizmat. Kerakli maʼlumotlar bir joyda, hisob-kitob esa aniq.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/login?next=/app" className="inline-flex items-center justify-center rounded-xl bg-[#39dc8b] px-6 py-4 font-extrabold text-[#052014] shadow-lg shadow-emerald-950/40 transition hover:-translate-y-0.5 hover:bg-[#68eaa8]">Bepul boshlash <span className="ml-2">→</span></Link>
            <Link href="/features" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-bold text-white transition hover:bg-white/10">Imkoniyatlarni koʻrish</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#9ab3a3]"><span>✓ Telefon va kompyuterda</span><span>✓ Bitta hisob, umumiy maʼlumotlar</span><span>✓ Oʻzbek tilida</span></div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-[#1bb56b]/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#10291b] p-3 shadow-2xl shadow-black/40">
            <MarketingPhoto spriteIndex={0} alt="Doʻkonda mijoz bilan hisob-kitob qilayotgan sotuvchi" loading="eager" className="h-[270px] w-full rounded-[22px] sm:h-[350px]" />
            <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/15 bg-[#06170ee8] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between"><div><p className="text-xs text-[#8fb7a0]">QarzDaftar bilan</p><p className="mt-1 text-lg font-extrabold text-white">Hisob-kitoblar tartibda</p></div><img src="/brand/qarzdaftar-mark.svg" alt="QarzDaftar" className="h-12 w-12" /></div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-white/5 p-3"><p className="text-[10px] text-[#9db5a6]">Mijozlar</p><p className="mt-1 text-sm font-bold text-white">Baza</p></div><div className="rounded-xl bg-white/5 p-3"><p className="text-[10px] text-[#9db5a6]">Qarzlar</p><p className="mt-1 text-sm font-bold text-white">Nazorat</p></div><div className="rounded-xl bg-white/5 p-3"><p className="text-[10px] text-[#9db5a6]">Toʻlovlar</p><p className="mt-1 text-sm font-bold text-white">Tarix</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-white/10 bg-[#081a10]">
      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-9 sm:grid-cols-3 lg:px-8">
        {[["Tartib", "Mijozlar va hisob-kitoblar bir joyda"],["Aniqlik", "Qarz va toʻlovlar tarixi saqlanadi"],["Qulaylik", "Telefon yoki kompyuterdan foydalaning"]].map(([a,b])=><div key={a} className="border-l-2 border-[#39d887] pl-4"><p className="text-lg font-extrabold text-white">{a}</p><p className="mt-1 text-sm text-[#91aa9a]">{b}</p></div>)}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <SectionHeading eyebrow="Nimalar mumkin?" title="Kundalik ish uchun kerakli vositalar" text="Daftardagi yozuvlarni izlash yoki turli joylarda saqlangan maʼlumotlarni yigʻish oʻrniga, jarayonlarni yagona tizimda yuriting." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(([n,t,d])=><article key={n} className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#10281a] to-[#09170f] p-6 transition hover:-translate-y-1 hover:border-[#2d8654]"><p className="text-sm font-black tracking-widest text-[#43df91]">{n}</p><h3 className="mt-5 text-lg font-extrabold text-white">{t}</h3><p className="mt-3 text-sm leading-7 text-[#98b0a0]">{d}</p></article>)}
      </div>
      <div className="mt-8 text-center"><Link href="/features" className="text-sm font-bold text-[#55e49b] hover:underline">Barcha imkoniyatlarni koʻrish →</Link></div>
    </section>

    <section className="bg-[#0a1d12] py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10"><MarketingPhoto spriteIndex={3} alt="Moliyaviy statistikani koʻrayotgan biznes egasi" className="h-[340px] w-full sm:h-[430px]" /></div>
        <div><SectionHeading eyebrow="Har kuni qulay" title="Daftarni qidirishga vaqt ketkazmang" text="Mijozning ismini toping, qarz qoldigʻini tekshiring va toʻlovni qayd qiling. Kerakli tarix bitta mijoz kartasida jamlanadi."/><Link href="/how-it-works" className="mt-7 inline-flex rounded-xl border border-[#327c51] px-5 py-3 font-bold text-[#baf5d0] hover:bg-[#123321]">Qanday ishlashini koʻrish →</Link></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="grid items-center gap-10 rounded-[30px] border border-[#24623e] bg-gradient-to-br from-[#123d25] to-[#07180e] p-7 sm:p-10 lg:grid-cols-[1fr_.8fr]">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#68e9a3]">Istalgan joyda</p><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">QarzDaftar telefoningizda ham</h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#b0c8b8]">Android ilovasini yuklab oling va veb-saytdagi hisobingiz bilan kiring. Maʼlumotlar internet orqali hisobingiz bilan sinxron ishlaydi.</p><Link href="/download" className="mt-7 inline-flex rounded-xl bg-[#3cde8e] px-6 py-3.5 font-extrabold text-[#062014]">Android ilova haqida →</Link></div>
        <div className="mx-auto flex w-full max-w-xs items-center justify-center rounded-[32px] border-[7px] border-[#294c37] bg-[#06130b] p-3 shadow-2xl"><div className="w-full rounded-[22px] bg-[#102a1a] p-5"><img src="/brand/qarzdaftar-mark.svg" alt="QarzDaftar belgisi" className="mx-auto h-16 w-16"/><p className="mt-4 text-center text-lg font-black text-white">QarzDaftar</p><p className="mt-1 text-center text-xs text-[#94b29f]">Hisobingiz doimo yoningizda</p><div className="mt-6 space-y-2"><div className="h-10 rounded-lg bg-white/10"/><div className="h-10 rounded-lg bg-white/10"/><div className="h-10 rounded-lg bg-[#1c7545]"/></div></div></div>
      </div>
    </section>

    <section className="px-5 pb-20"><div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#10271a] px-6 py-12 text-center sm:px-12"><h2 className="text-3xl font-black text-white">Hisob-kitoblaringizni tartibga solishga tayyormisiz?</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#a2b9aa]">QarzDaftar hisobini yarating va mijozlaringiz bilan ishlashni qulayroq qiling.</p><Link href="/login?next=/app" className="mt-7 inline-flex rounded-xl bg-[#3cde8e] px-7 py-3.5 font-extrabold text-[#062014]">Roʻyxatdan oʻtish</Link></div></section>
  </MarketingFrame>;
}
