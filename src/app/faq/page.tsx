import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

const groups = [
 ["Boshlash", [
  ["QarzDaftar kimlar uchun?", "Xizmat mijozlar, qarzlar va toʻlovlarni tartibli yuritishni istagan doʻkonlar hamda kichik bizneslar uchun moʻljallangan."],
  ["Qanday roʻyxatdan oʻtaman?", "Kirish / Roʻyxatdan oʻtish sahifasiga oʻting va formadagi maydonlarni toʻldiring. Hisob yaratilgach, shaxsiy kabinetingizga kiring."],
  ["Saytdan telefonda foydalana olamanmi?", "Ha. Veb-sayt telefon va kompyuter ekranlariga moslashadi. Brauzer orqali hisobingizga kirishingiz mumkin."]
 ]],
 ["Mijozlar va hisob-kitoblar", [
  ["Mijozga qanday qarz yozaman?", "Mijozlar boʻlimidan kerakli mijozni tanlang, qarz summasi va sanasini kiriting. Saqlashdan oldin mijoz va summani tekshiring."],
  ["Qisman toʻlovni qayd etish mumkinmi?", "Toʻlovlarni alohida yozuv sifatida qayd etish mumkin. Har bir toʻlovni toʻgʻri mijozga bogʻlab kiritish muhim."],
  ["Oldingi toʻlovlarni qayerdan koʻraman?", "Tegishli mijozning hisob kartasi yoki toʻlovlar tarixidan mavjud yozuvlarni tekshiring."]
 ]],
 ["Hisob va xavfsizlik", [
  ["Sayt va Android ilovada alohida hisob kerakmi?", "Loyiha maqsadi — Android ilovasi va veb-saytdan bitta hisob bilan foydalanish. APK ommaviy chiqarilganda sahifada yuklab olish havolasi beriladi."],
  ["Tarif va obunani qayerdan koʻraman?", "Kabinetga kirib, Obuna boʻlimini oching. Amaldagi tarif va toʻlov holatini shu yerda tekshiring."],
  ["Parolni unutib qoʻysam nima qilaman?", "Kirish sahifasida mavjud parolni tiklash imkoniyatini tekshiring. Agar u koʻrinmasa, kabinetdagi yordam boʻlimi yoki administrator orqali yordam soʻrang."],
  ["Maʼlumotlarimni qanday himoya qilaman?", "Kuchli va alohida parol ishlating, uni hech kimga bermang. Umumiy qurilmada ish tugagach hisobdan chiqing."]
 ]]
];

export default function FaqPage() {
 return <MarketingFrame><section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
  <SectionHeading eyebrow="Savol-javob" title="QarzDaftar haqida koʻp soʻraladigan savollar" text="Roʻyxatdan oʻtish, mijozlar bilan ishlash, toʻlovlar va hisob xavfsizligi boʻyicha qisqa javoblar." />
  <div className="mt-10 space-y-10">{groups.map(([group,items])=><div key={group as string}><h2 className="mb-4 text-xl font-black text-white">{group as string}</h2><div className="space-y-3">{(items as string[][]).map(([q,a])=><details key={q} className="group rounded-2xl border border-white/10 bg-[#0b2014] p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-white">{q}<span className="text-xl text-[#51df97]">+</span></summary><p className="mt-4 max-w-3xl text-sm leading-7 text-[#a9c0b1]">{a}</p></details>)}</div></div>)}</div>
  <div className="mt-12 rounded-3xl border border-[#286a44] bg-[#0d2b1a] p-8"><h2 className="text-xl font-black text-white">Javob topa olmadingizmi?</h2><p className="mt-2 text-sm leading-7 text-[#a9c0b1]">Hisobingizga kira olsangiz, qoʻllab-quvvatlash boʻlimidan murojaat yuborish imkoniyatini tekshiring.</p><Link href="/contact" className="mt-5 inline-flex font-bold text-[#65e8a1]">Aloqa sahifasi →</Link></div>
 </section></MarketingFrame>;
}
