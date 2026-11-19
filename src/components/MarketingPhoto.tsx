"use client";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  spriteIndex?: number;
};

const positions = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%", "100% 100%"];

export default function MarketingPhoto({ src, alt, className = "", loading = "lazy", spriteIndex }: Props) {
  if (spriteIndex !== undefined) {
    const position = positions[Math.max(0, Math.min(5, spriteIndex))];
    return <div role="img" aria-label={alt} className={`overflow-hidden bg-[#102d1c] ${className}`} style={{ backgroundImage: "url('/images/qarzdaftar-features.webp')", backgroundRepeat: "no-repeat", backgroundSize: "300% 200%", backgroundPosition: position }} />;
  }
  return <div className={`relative overflow-hidden bg-[#102d1c] ${className}`}><img src={src} alt={alt} loading={loading} decoding="async" className="h-full w-full object-cover" /></div>;
}
