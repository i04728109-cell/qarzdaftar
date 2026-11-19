"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteStyleSwitcher } from "@/components/SiteStyleSwitcher";

const nav = [
  ["/features", "Imkoniyatlar"],
  ["/how-it-works", "Qanday ishlaydi"],
  ["/about", "Biz haqimizda"],
  ["/pricing", "Tariflar"],
  ["/faq", "Savol-javob"],
  ["/contact", "Aloqa"],
] as const;

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" aria-label="QarzDaftar bosh sahifa" className="inline-flex items-center gap-2.5">
    <img src="/brand/qarzdaftar-mark.svg" alt="" className="h-10 w-10" />
    <span className={`text-[21px] font-black tracking-tight ${light ? "text-white" : "text-[#eafff2]"}`}>Qarz<span className="text-[#32d583]">Daftar</span></span>
  </Link>;
}

export function MarketingHeader() {
  const pathname = usePathname();
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06150e]/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5 lg:px-8">
      <Brand />
      <nav className="hidden items-center gap-6 xl:flex">
        {nav.map(([href,label]) => <Link key={href} href={href} className={`text-sm font-medium transition hover:text-[#54e69a] ${pathname===href ? "text-[#54e69a]" : "text-[#a7c0b1]"}`}>{label}</Link>)}
      </nav>
      <div className="flex items-center gap-2">
        <SiteStyleSwitcher />
        <Link href="/login?next=/app" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#dff8e9] transition hover:bg-white/5 sm:inline-flex">Kirish</Link>
        <Link href="/download" className="rounded-xl bg-[#35d887] px-4 py-2.5 text-sm font-bold text-[#052014] transition hover:bg-[#65e9a5]">Ilovani olish</Link>
      </div>
    </div>
    <nav className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-5 pb-3 xl:hidden">
      {nav.map(([href,label]) => <Link key={href} href={href} className={`whitespace-nowrap text-xs font-medium ${pathname===href ? "text-[#54e69a]" : "text-[#91ad9d]"}`}>{label}</Link>)}
    </nav>
  </header>;
}

export function MarketingFooter() {
  return <footer className="border-t border-white/10 bg-[#04100a]">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
      <div><Brand /><p className="mt-4 max-w-sm text-sm leading-7 text-[#91aa9a]">Mijozlar, qarzlar va toʻlovlarni bir joyda boshqarish uchun sodda raqamli daftar. Hisob-kitoblaringiz doimo tartibda.</p></div>
      <div><p className="mb-4 text-sm font-bold text-white">QarzDaftar</p><div className="flex flex-col gap-3 text-sm text-[#91aa9a]"><Link href="/about">Biz haqimizda</Link><Link href="/features">Imkoniyatlar</Link><Link href="/how-it-works">Qanday ishlaydi</Link></div></div>
      <div><p className="mb-4 text-sm font-bold text-white">Yordam</p><div className="flex flex-col gap-3 text-sm text-[#91aa9a]"><Link href="/faq">Savol-javob</Link><Link href="/contact">Aloqa</Link><Link href="/pricing">Tariflar</Link></div></div>
      <div><p className="mb-4 text-sm font-bold text-white">Boshlash</p><div className="flex flex-col gap-3 text-sm text-[#91aa9a]"><Link href="/login?next=/app">Kirish / Roʻyxatdan oʻtish</Link><Link href="/download">Android ilova</Link></div></div>
    </div>
    <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[#718b7b]">© {new Date().getFullYear()} QarzDaftar. Barcha huquqlar himoyalangan.</div>
  </footer>;
}

export function MarketingFrame({ children }: { children: React.ReactNode }) {
  return <><MarketingHeader /><main>{children}</main><MarketingFooter /></>;
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#4bdf94]">{eyebrow}</p><h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">{title}</h2><p className="mt-4 text-base leading-7 text-[#a1b9aa]">{text}</p></div>;
}
