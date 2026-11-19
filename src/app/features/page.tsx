import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";
const features = [
 ["Mijozlar bazasi","Mijozning ismi, telefon raqami va tegishli maʼlumotlarini bir joyda saqlang.","Mijozlar roʻyxati telefon ekranida."],
 ["Qarzlarni yuritish","Har bir qarzning summasi, sanasi va qolgan balansini alohida kuzating.","QarzDaftar bilan ishlayotgan sotuvchi."],
 ["Toʻlovlar tarixi","Qabul qilingan toʻlovlarni qayd etib, oldingi operatsiyalarni tekshiring.","Telefon ekranida muvaffaqiyatli toʻlov."],
 ["Statistika va hisobot","Umumiy holatni koʻrish uchun moliyaviy koʻrsatkichlarni jamlang.","Qarz va toʻlovlar statistikasi."],
 ["Bir nechta qurilmada","Veb-sayt va Android ilovasida bir hisob bilan foydalaning.","QarzDaftar ilovasi smartfonda."],
 ["Hisob xavfsizligi","Har bir foydalanuvchi oʻz hisobiga kiradi. Maxfiy parolingizni hech kimga bermang.","Smartfondan xavfsiz foydalanayotgan mijoz."],
];
export default function FeaturesPage(){return <MarketingFrame><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><SectionHeading eyebrow="Imkoniyatlar" title="Biznes hisob-kitoblari uchun bitta qulay joy" text="QarzDaftar kundalik savdo jarayonlarida mijozlar va toʻlovlarni tartibli yuritishga yordam beradi. Quyidagi vositalar orqali ish jarayonini soddalashtiring."/><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{features.map(([t,d],i)=><article key={t} className="rounded-3xl border border-white/10 bg-[#0b2014] p-6"><p className="text-xs font-bold text-[#48df95]">0{i+1} / IMKONIYAT</p><h2 className="mt-3 text-xl font-extrabold text-white">{t}</h2><p className="mt-3 text-sm leading-7 text-[#9eb5a6]">{d}</p></article>)}</div><div className="mt-12 rounded-3xl bg-[#123520] p-8 text-center"><h2 className="text-2xl font-black text-white">QarzDaftarni sinab koʻring</h2><p className="mt-2 text-sm text-[#a7c1b0]">Hisob yarating va oʻzingizga kerakli boʻlimlar bilan tanishing.</p><Link href="/login?next=/app" className="mt-5 inline-flex rounded-xl bg-[#3cde8e] px-6 py-3 font-bold text-[#062014]">Boshlash →</Link></div></section></MarketingFrame>}
