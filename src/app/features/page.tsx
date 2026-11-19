import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

const features = [
  ["Mijozlar bazasi", "Har bir mijoz uchun alohida yozuv yarating. Ism va telefon raqamini saqlab, kerakli mijozni roʻyxatdan tez toping.", "Mijozlarni tartibli saqlash", "Mijozlar roʻyxati orqali kim bilan hisob-kitob qilayotganingizni aniq biling."],
  ["Qarzlarni yuritish", "Mijozga berilgan qarz summasi va sanasini qayd eting. Qolgan balansni alohida kuzatib boring.", "Qarz qoldigʻini nazorat qilish", "Har bir yozuv mijozning hisob-kitob tarixini tushunishga yordam beradi."],
  ["Toʻlovlar tarixi", "Mijoz pul qaytarganida toʻlovni qayd eting. Qisman toʻlovlarni ham hisobda saqlang.", "Oldingi amallarni tekshirish", "Qachon va qancha toʻlov qabul qilinganini tarix orqali ko‘rib chiqing."],
  ["Statistika va hisobot", "Umumiy qarz va toʻlovlar holatini jamlangan koʻrinishda kuzating.", "Umumiy manzarani koʻrish", "Hisob-kitoblarni alohida daftarlar yoki tarqoq yozuvlardan qidirmang."],
  ["Bir nechta qurilmada", "QarzDaftar veb-sayti telefon va kompyuter ekranlariga moslashadi. Android ilovasi alohida tayyorlanmoqda.", "Qulay foydalanish", "Veb-hisob va Android ilovasi bir hisob bilan ishlashi rejalashtirilgan."],
  ["Shaxsiy hisob", "Har bir foydalanuvchi oʻz hisobiga kiradi. Kirish maʼlumotlaringizni xavfsiz saqlang.", "Hisobingizni himoya qilish", "Parolingizni boshqa odamlar bilan ulashmang va umumiy qurilmada hisobdan chiqishni unutmang."]
];

export default function FeaturesPage() {
  return <MarketingFrame><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
    <SectionHeading eyebrow="Imkoniyatlar" title="Kundalik hisob-kitoblar uchun kerakli vositalar" text="QarzDaftar mijozlar, qarzlar va toʻlovlar haqidagi maʼlumotlarni bir joyda tartibli saqlashga yordam beradi. Har bir boʻlim muayyan vazifani bajaradi." />
    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(([title,desc,sub,detail],i)=><article key={title} className="rounded-3xl border border-white/10 bg-[#0b2014] p-7">
      <p className="text-xs font-bold tracking-widest text-[#48df95]">0{i+1} / IMKONIYAT</p><h2 className="mt-4 text-xl font-extrabold text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">{desc}</p><div className="mt-6 border-t border-white/10 pt-5"><h3 className="text-sm font-bold text-[#d9f8e5]">{sub}</h3><p className="mt-2 text-sm leading-7 text-[#819b8b]">{detail}</p></div>
    </article>)}</div>
    <div className="mt-12 rounded-3xl border border-[#286a44] bg-[#0d2b1a] p-8 sm:p-10"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-[#65e8a1]">Boshlash oson</p><h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Avval mijozlaringizni kiriting, keyin hisob-kitoblarni yuriting</h2><p className="mt-3 text-sm leading-7 text-[#a9c4b3]">Hisob yaratganingizdan soʻng mijozlar roʻyxatini shakllantiring. Har bir mijoz uchun qarz va toʻlov yozuvlarini alohida yuritishingiz mumkin.</p><Link href="/how-it-works" className="mt-6 inline-flex rounded-xl bg-[#3cde8e] px-6 py-3 font-bold text-[#062014]">Ishlash tartibini koʻrish →</Link></div></div>
  </section></MarketingFrame>;
}
