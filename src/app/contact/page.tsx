import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

export default function ContactPage() {
 return <MarketingFrame><section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
  <SectionHeading eyebrow="Aloqa va yordam" title="QarzDaftar boʻyicha yordam kerakmi?" text="Hisobingiz, mijozlar roʻyxati yoki hisob-kitob yozuvlari bilan bogʻliq savol tugʻilsa, quyidagi yoʻriqnomadan foydalaning." />
  <div className="mt-12 grid gap-5 md:grid-cols-2">
   <article className="rounded-3xl border border-white/10 bg-[#0b2014] p-8"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#17472b] text-xl font-black text-[#65e8a1]">01</div><h2 className="mt-5 text-xl font-extrabold text-white">Hisobingizga kira olsangiz</h2><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">Shaxsiy kabinetingizdagi Qoʻllab-quvvatlash boʻlimini oching. Murojaatda muammo qaysi sahifada yuz berganini va qanday natija kutganingizni yozing.</p><Link href="/login?next=/app/support" className="mt-6 inline-flex rounded-xl bg-[#3cde8e] px-5 py-3 font-bold text-[#062014]">Yordam boʻlimini ochish</Link></article>
   <article className="rounded-3xl border border-white/10 bg-[#0b2014] p-8"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#17472b] text-xl font-black text-[#65e8a1]">02</div><h2 className="mt-5 text-xl font-extrabold text-white">Hisobga kira olmasangiz</h2><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">Avval telefon raqami va parolni tekshiring. Muammo davom etsa, administrator bilan bogʻlanish uchun xizmatdan foydalanish jarayonida sizga berilgan rasmiy aloqa kanalidan foydalaning.</p><Link href="/login" className="mt-6 inline-flex rounded-xl border border-[#4a9a69] px-5 py-3 font-bold text-white">Kirish sahifasi</Link></article>
  </div>
  <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b2014] p-6"><h2 className="text-lg font-bold text-white">Murojaat yuborishda nimalarni yozish kerak?</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[#a9c0b1]"><li>Muammo yuz bergan boʻlim nomi.</li><li>Qanday amallarni bajarganingiz.</li><li>Ekranda chiqqan xabar matni.</li><li>Muammo qachondan beri kuzatilayotgani.</li></ul><p className="mt-4 text-xs leading-6 text-[#819b8b]">Parolingizni, tasdiqlash kodlarini yoki boshqa maxfiy maʼlumotlarni murojaatga kiritmang.</p></div>
 </section></MarketingFrame>;
}
