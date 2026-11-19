"use client";
import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  spriteIndex?: number;
};

// Separate high-resolution photographs for each marketing section.
const photos = [
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9d?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=90",
];

export default function MarketingPhoto({ src, alt, className = "", loading = "lazy", spriteIndex }: Props) {
  const index = spriteIndex === undefined ? 0 : Math.max(0, Math.min(5, spriteIndex));
  const [failed, setFailed] = useState(false);
  const image = src || photos[index];

  return (
    <div className={`relative overflow-hidden bg-[#102d1c] ${className}`}>
      {!failed ? (
        <img
          src={image}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src="/images/qarzdaftar-photo-fallback.svg"
          alt={alt}
          className="h-full min-h-40 w-full object-cover"
        />
      )}
    </div>
  );
}
