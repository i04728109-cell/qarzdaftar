import Link from "next/link";
import { MarketingFrame, SectionHeading } from "@/components/Marketing";

const points = [
 ["Bitta hisob", "Android ilovasi tayyor boʻlgach, veb-saytdagi hisobingiz bilan kirish imkoniyati rejalashtirilgan."],
 ["Mijozlar va yozuvlar", "Mijozlar, qarzlar va toʻlovlar haqidagi maʼlumotlarni telefon orqali qulay koʻrish maqsad qilingan."],
 ["Rasmiy fayl", "APK ommaviy tarqatishga tayyor boʻlganda, yuklab olish havolasi shu sahifada beriladi."]
];

export default function DownloadPage() {
 return <MarketingFrame><section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
  <div className="max-w-3xl"><SectionHeading eyebrow="Android ilova" title="QarzDaftar telefoningizda" text="QarzDaftar Android ilovasi telefon orqali mijozlar va hisob-kitoblarni yuritishni qulaylashtirish uchun tayyorlanmoqda. Ilova chiqarilganda rasmiy APK havolasi shu sahifada joylashtiriladi." /></div>
  <div className="mt-10 rounded-3xl border border-[#8b692d]/50 bg-[#30230e] p-7 sm:p-8"><p className="text-sm font-bold text-[#f2d9a7]">APK hozircha yuklab olishga tayyor deb tasdiqlanmagan.</p><p className="mt-3 text-sm leading-7 text-[#e4cda3]">Tekshirilmagan faylni oʻrnatmang. Rasmiy APK tayyor boʻlgach, ushbu sahifadagi yuklab olish tugmasi faollashtiriladi.</p></div>
  <div className="mt-10 grid gap-5 md:grid-cols-3">{points.map(([title,desc],i)=><article key={title} className="rounded-2xl border border-white/10 bg-[#0b2014] p-6"><p className="text-xs font-bold text-[#48df95]">0{i+1}</p><h2 className="mt-3 text-lg font-extrabold text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">{desc}</p></article>)}</div>
  <div className="mt-10 rounded-3xl border border-[#286a44] bg-[#0d2b1a] p-8"><h2 className="text-2xl font-black text-white">Hozir foydalanishni boshlang</h2><p className="mt-3 text-sm leading-7 text-[#a9c0b1]">Android ilova tayyor boʻlishini kutmasdan, QarzDaftar veb-versiyasiga telefon yoki kompyuteringiz brauzeridan kirishingiz mumkin.</p><Link href="/login?next=/app" className="mt-6 inline-flex rounded-xl bg-[#3cde8e] px-6 py-3 font-bold text-[#062014]">Veb-versiyaga kirish</Link></div>
 </section></MarketingFrame>;
}
