"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
};

export default function MarketingPhoto({ src, alt, className = "", loading = "lazy" }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#102d1c] ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={loading === "eager" ? "high" : "auto"}
        className="h-full w-full object-cover"
        onError={() => {
          if (!failed) {
            setFailed(true);
            setCurrentSrc("/images/qarzdaftar-photo-fallback.svg");
          }
        }}
      />
      {failed && (
        <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-[#06170e]/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          QarzDaftar
        </span>
      )}
    </div>
  );
}
