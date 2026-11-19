import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

const APK_URL = "https://github.com/i04728109-cell/qarzdaftar/releases/download/android-build-61/qarzdaftar.apk";

const points = [
 ["Bitta hisob", "Ilovani oʻrnatgach, QarzDaftar xizmatiga kirib, hisobingizdan foydalaning."],
 ["Mijozlar va yozuvlar", "Mijozlar, qarzlar va toʻlovlar haqidagi maʼlumotlarni bir joyda tartibli yuriting."],
 ["Rasmiy APK", "Fayl QarzDaftar loyihasining rasmiy GitHub relizidan taqdim etiladi."]
];

export default function DownloadPage() {
 return <MarketingFrame><section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
  <div className="max-w-3xl"><SectionHeading eyebrow="Android ilova" title="QarzDaftar telefoningizda" text="Android uchun QarzDaftar APK fayli tayyor. Quyidagi tugma orqali rasmiy oʻrnatish faylini yuklab olishingiz mumkin." /></div>
  <div className="mt-10 rounded-3xl border border-[#286b46] bg-gradient-to-br from-[#123d25] to-[#0a1a10] p-7 sm:p-9">
   <p className="text-xs font-bold uppercase tracking-[.18em] text-[#68e9a3]">Yuklab olishga tayyor</p>
   <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">QarzDaftar Android APK</h2>
   <p className="mt-3 text-sm leading-7 text-[#c0d5c7]">Fayl hajmi: taxminan 4,1 MB. Yuklab olish tugmasini bosing, soʻng Android qurilmangizda faylni ochib oʻrnatish bosqichlarini bajaring.</p>
   <a href={APK_URL} download="qarzdaftar.apk" className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#39dc8b] px-7 py-4 font-extrabold text-[#052014] transition hover:bg-[#68eaa8]">↓ QarzDaftar APK yuklab olish</a>
   <p className="mt-4 text-xs leading-6 text-[#a9c0b1]">Faqat Android qurilmalar uchun. Yuklab olish manbasi — QarzDaftar rasmiy GitHub relizi.</p>
  </div>
  <div className="mt-10 grid gap-5 md:grid-cols-3">{points.map(([title,desc],i)=><article key={title} className="rounded-2xl border border-white/10 bg-[#0b2014] p-6"><p className="text-xs font-bold text-[#48df95]">0{i+1}</p><h2 className="mt-3 text-lg font-extrabold text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">{desc}</p></article>)}</div>
  <div className="mt-10 rounded-3xl border border-[#286a44] bg-[#0d2b1a] p-8"><h2 className="text-2xl font-black text-white">Yangi foydalanuvchimisiz?</h2><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">Avval hisob yarating yoki mavjud hisobingizga kiring.</p><Link href="/login?next=/app" className="mt-6 inline-flex rounded-xl bg-[#3cde8e] px-6 py-3 font-bold text-[#062014]">Roʻyxatdan oʻtish / Kirish</Link></div>
 </section></MarketingFrame>;
}
