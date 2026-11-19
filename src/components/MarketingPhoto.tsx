"use client";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  spriteIndex?: number;
};

// Photo-free animated product illustration. All elements are local CSS shapes.
export default function MarketingPhoto({ alt, className = "", spriteIndex = 0 }: Props) {
  const variants = [
    { label: "Mijozlar", value: "128", detail: "Faol mijozlar", bars: ["w-4/5", "w-3/5", "w-full"] },
    { label: "Qarzlar", value: "2 450 000", detail: "Jami qoldiq", bars: ["w-3/5", "w-4/5", "w-2/3"] },
    { label: "Toʻlovlar", value: "850 000", detail: "Bugungi tushum", bars: ["w-full", "w-2/3", "w-4/5"] },
    { label: "Hisobot", value: "92%", detail: "Toʻlovlar nazorati", bars: ["w-4/5", "w-full", "w-3/5"] },
    { label: "QarzDaftar", value: "Hammasi joyida", detail: "Hisobingiz sinxron", bars: ["w-2/3", "w-4/5", "w-full"] },
    { label: "Biznesingiz", value: "Bir joyda", detail: "Oddiy va qulay boshqaruv", bars: ["w-full", "w-3/5", "w-4/5"] },
  ];
  const item = variants[Math.max(0, Math.min(5, spriteIndex))];
  const compact = className.includes("h-52");
  return (
    <div role="img" aria-label={alt} className={`qd-visual relative isolate overflow-hidden bg-[#071b10] ${className}`}>
      <div className="qd-visual-glow absolute -right-12 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="qd-visual-glow qd-visual-glow-delay absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="absolute inset-0 opacity-[.09]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.22) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="qd-float relative mx-auto flex h-full w-full max-w-md items-center justify-center p-5 sm:p-8">
        <div className={`qd-visual-panel w-full rounded-[26px] border border-white/15 bg-[#0b2618]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6 ${compact ? "qd-visual-panel--compact" : ""}`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15"><img src="/brand/qarzdaftar-mark.svg" alt="" className="h-7 w-7" /></div><div><p className="text-xs font-bold text-white">QarzDaftar</p><p className="mt-1 text-[10px] text-emerald-200/60">Boshqaruv paneli</p></div></div>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.9)]" />
          </div>
          <div className="py-5"><p className="text-xs text-emerald-100/60">{item.label}</p><p className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{item.value}</p><p className="mt-1 text-xs text-emerald-200/60">{item.detail}</p></div>
          <div className="space-y-3">{item.bars.map((width, i) => <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[.06] bg-white/[.035] p-3"><span className="h-8 w-8 rounded-lg bg-emerald-300/10" /><div className="flex-1 space-y-2"><div className={`h-1.5 rounded-full bg-emerald-300/70 ${width}`} /><div className="h-1 w-2/5 rounded-full bg-white/15" /></div><span className="h-2 w-2 rounded-full bg-emerald-300/70" /></div>)}</div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-400/10 px-4 py-3"><span className="text-xs font-semibold text-emerald-100">Maʼlumotlar himoyalangan</span><span className="text-xs font-bold text-emerald-300">● LIVE</span></div>
        </div>
      </div>
      <div className="qd-orbit absolute right-[8%] top-[12%] h-12 w-12 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 backdrop-blur" />
      <div className="qd-orbit qd-orbit-delay absolute bottom-[12%] left-[7%] h-8 w-8 rounded-full border border-teal-200/20 bg-teal-300/10" />
    </div>
  );
}
