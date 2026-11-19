import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

const steps = [
 ["Hisob yarating", "Kirish / Roʻyxatdan oʻtish sahifasiga oʻting va hisobingizni yarating. Parolni xavfsiz joyda saqlang.", "Shaxsiy kabinetingizga kirish imkoniga ega boʻlasiz."],
 ["Mijozlarni qoʻshing", "Mijozlar boʻlimida ism va mavjud aloqa maʼlumotlarini kiriting. Yozuvlarni tushunarli nomlang.", "Mijozlar bazasi keyingi hisob-kitoblar uchun asos boʻladi."],
 ["Qarz yozuvini kiriting", "Tegishli mijozni tanlang, qarz summasi va sanasini kiriting. Kiritilgan maʼlumotlarni saqlashdan oldin tekshiring.", "Qarz mijoz hisobida qayd etiladi."],
 ["Toʻlovni qayd eting", "Mijoz toʻlov qilganida uning summasini kiriting. Qisman toʻlovlarni ham alohida qayd etib boring.", "Toʻlovlar tarixi hisobning qanday oʻzgarganini koʻrsatadi."],
 ["Hisobni tekshirib boring", "Mijoz kartasi, qarzlar roʻyxati va mavjud hisobotlarni vaqti-vaqti bilan tekshiring.", "Maʼlumotlar tartibli va dolzarb boʻlib turadi."]
];

export default function HowPage() {
 return <MarketingFrame><section className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
  <SectionHeading eyebrow="Qanday ishlaydi?" title="QarzDaftardan foydalanish bosqichlari" text="Ishni boshlash uchun murakkab sozlamalar talab qilinmaydi. Quyidagi ketma-ketlik mijozlar va hisob-kitoblarni tartibga solishga yordam beradi." />
  <div className="mt-12 space-y-4">{steps.map(([title,desc,result],i)=><article key={title} className="flex gap-5 rounded-2xl border border-white/10 bg-[#0b2014] p-6"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#16452a] text-lg font-black text-[#62e8a0]">0{i+1}</div><div><h2 className="text-lg font-bold text-white">{title}</h2><p className="mt-2 text-sm leading-7 text-[#a9c0b1]">{desc}</p><p className="mt-3 text-xs font-semibold text-[#65d99a]">Natija: {result}</p></div></article>)}</div>
  <div className="mt-12 rounded-3xl border border-[#286a44] bg-[#0d2b1a] p-8"><h2 className="text-2xl font-black text-white">Hisob-kitobni muntazam tekshiring</h2><p className="mt-3 text-sm leading-7 text-[#a9c4b3]">Yozuvlarni vaqtida kiritish va toʻlovlarni darhol qayd etish maʼlumotlarning aniqligini saqlashga yordam beradi. Notoʻgʻri summa yoki mijoz tanlangan boʻlsa, saqlashdan oldin qayta tekshiring.</p><Link href="/login?next=/app" className="mt-6 inline-flex rounded-xl bg-[#3cde8e] px-6 py-3 font-bold text-[#062014]">Hisob yaratish</Link></div>
 </section></MarketingFrame>;
}
