import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

const principles = [
 ["Soddalik", "Kundalik ishda kerak boʻladigan maʼlumotlarni tushunarli tartibda saqlash."],
 ["Aniqlik", "Qarz va toʻlovlarni oʻz vaqtida qayd etish orqali hisob holatini kuzatish."],
 ["Tartib", "Mijozlar haqidagi yozuvlarni bitta joyda jamlash va kerakli maʼlumotni tez topish."],
 ["Qulaylik", "Veb-saytdan telefon yoki kompyuter orqali foydalanish."]
];

export default function AboutPage() {
 return <MarketingFrame><section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
  <SectionHeading eyebrow="Biz haqimizda" title="Kundalik savdo hisobini tushunarli va tartibli yuritish" text="QarzDaftar — mijozlar, qarzlar va toʻlovlar haqidagi yozuvlarni bir joyda saqlash uchun yaratilgan raqamli daftar. U kichik savdo nuqtalari va kundalik hisob-kitob yuritadigan foydalanuvchilar uchun moʻljallangan." />
  <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-3xl border border-white/10 bg-[#0b2014] p-8"><h2 className="text-2xl font-black text-white">Nima muammoni hal qiladi?</h2><p className="mt-4 text-sm leading-8 text-[#a9c0b1]">Qogʻoz daftarlar, alohida fayllar va xotiraga tayanish mijozlar bilan hisob-kitob qilganda chalkashlik keltirib chiqarishi mumkin. QarzDaftar maʼlumotlarni mijozlar kesimida jamlash, qarz yozuvlarini saqlash va kelib tushgan toʻlovlarni qayd etish uchun yagona ish joyini taklif qiladi.</p><p className="mt-4 text-sm leading-8 text-[#a9c0b1]">Tizimdan samarali foydalanish uchun har bir qarz va toʻlovni oʻz vaqtida, toʻgʻri mijozga bogʻlab kiritish muhim.</p></div><div className="rounded-3xl border border-[#286a44] bg-gradient-to-br from-[#123a23] to-[#09190f] p-8"><p className="text-xs font-bold uppercase tracking-widest text-[#70e9a7]">Bizning yondashuv</p><h2 className="mt-3 text-2xl font-black text-white">Hisob-kitoblar bir joyda</h2><p className="mt-4 text-sm leading-7 text-[#b0c8b8]">Maqsad — kundalik hisobni ortiqcha murakkablashtirmasdan, mijozlar va toʻlovlar tarixini tartibli yuritishga yordam berish.</p><Link href="/features" className="mt-6 inline-flex font-bold text-[#65e8a1]">Imkoniyatlarni koʻrish →</Link></div></div>
  <h2 className="mt-14 text-2xl font-black text-white">Asosiy tamoyillar</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{principles.map(([title,desc],i)=><article key={title} className="rounded-2xl border border-white/10 bg-[#0b2014] p-6"><p className="text-xs font-bold text-[#48df95]">0{i+1}</p><h3 className="mt-3 text-lg font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-7 text-[#9eb5a6]">{desc}</p></article>)}</div>
 </section></MarketingFrame>;
}
