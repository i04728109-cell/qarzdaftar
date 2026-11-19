"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
};

const FALLBACK = "/images/qarzdaftar-photo-fallback.svg";

export default function MarketingPhoto({ src, alt, className = "", loading = "lazy" }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [usingFallback, setUsingFallback] = useState(false);
  const [hideImage, setHideImage] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#102d1c] ${className}`}>
      {!hideImage ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={loading === "eager" ? "high" : "auto"}
          className="h-full w-full object-cover"
          onError={() => {
            if (!usingFallback) {
              setUsingFallback(true);
              setCurrentSrc(FALLBACK);
            } else {
              setHideImage(true);
            }
          }}
        />
      ) : (
        <div aria-label={alt} role="img" className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#174b2e] via-[#0d2a1a] to-[#06170e]">
          <div className="rounded-2xl border border-[#4be092]/30 bg-[#071b10]/70 px-6 py-5 text-center">
            <img src="/brand/qarzdaftar-mark.svg" alt="" className="mx-auto h-12 w-12" />
            <p className="mt-3 text-sm font-bold text-[#dff8e9]">QarzDaftar</p>
          </div>
        </div>
      )}
      {usingFallback && !hideImage && (
        <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-[#06170e]/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          QarzDaftar
        </span>
      )}
    </div>
  );
}
