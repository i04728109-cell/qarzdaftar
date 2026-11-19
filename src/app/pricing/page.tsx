import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

export default function PricingPage() {
 return <MarketingFrame><section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
  <SectionHeading eyebrow="Tariflar" title="Tarif va obuna maʼlumotlari" text="Obuna shartlari foydalanuvchi hisobida koʻrsatiladi. Bu sahifada tasdiqlanmagan narx yoki chegirmalarni keltirmaymiz — toʻlovdan oldin shaxsiy kabinetingizdagi amaldagi maʼlumotni tekshiring." />
  <div className="mt-12 grid gap-6 md:grid-cols-2">
   <article className="rounded-3xl border border-white/10 bg-[#0b2014] p-8"><p className="text-sm font-bold text-[#4be092]">Yangi foydalanuvchilar</p><h2 className="mt-3 text-2xl font-black text-white">Avval hisob yarating</h2><p className="mt-4 text-sm leading-7 text-[#a9c0b1]">Roʻyxatdan oʻting va shaxsiy kabinetingizga kiring. Obuna boʻlimida sizga tegishli tarif va foydalanish holati haqidagi maʼlumotlar koʻrsatiladi.</p><Link href="/login?next=/app" className="mt-7 inline-flex rounded-xl bg-[#3cde8e] px-6 py-3 font-bold text-[#062014]">Roʻyxatdan oʻtish</Link></article>
   <article className="rounded-3xl border border-[#286a44] bg-gradient-to-br from-[#123a23] to-[#09190f] p-8"><p className="text-sm font-bold text-[#7df0ad]">Mavjud foydalanuvchilar</p><h2 className="mt-3 text-2xl font-black text-white">Obunani tekshiring</h2><p className="mt-4 text-sm leading-7 text-[#b0c8b8]">Kabinetga kiring va Obuna boʻlimini oching. Toʻlov qilishdan oldin tarif nomi, narxi, amal qilish muddati va shartlarini diqqat bilan tekshiring.</p><Link href="/login?next=/app/subscription" className="mt-7 inline-flex rounded-xl border border-[#4a9a69] px-6 py-3 font-bold text-white hover:bg-white/5">Kabinetga kirish</Link></article>
  </div>
  <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b2014] p-6"><h2 className="text-lg font-bold text-white">Toʻlovdan oldin nimalarni tekshirish kerak?</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[#a9c0b1]"><li>Tanlangan tarifning nomi va narxi.</li><li>Obunaning boshlanish va tugash sanasi.</li><li>Toʻlov usuli va toʻlov tasdiqlanganligi.</li><li>Tarifga kiradigan imkoniyatlar va cheklovlar.</li></ul></div>
 </section></MarketingFrame>;
}
