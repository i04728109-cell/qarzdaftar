"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "bright";
const options: { id: Theme; label: string; swatches: string[] }[] = [
  { id: "dark", label: "Asosiy", swatches: ["#04100c", "#0d1f19", "#22e07a"] },
  { id: "bright", label: "Yorqin", swatches: ["#ffffff", "#f4f7f5", "#047857"] },
];

export function SiteStyleSwitcher({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const saved = localStorage.getItem("qd-theme");
    const initial: Theme = saved === "bright" ? "bright" : document.documentElement.dataset.theme === "bright" ? "bright" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    document.body.dataset.qdTheme = initial === "bright" ? "light" : "forest";
    document.documentElement.style.colorScheme = initial === "bright" ? "light" : "dark";
  }, []);
  function chooseTheme(next: Theme) {
    setTheme(next);
    localStorage.setItem("qd-theme", next);
    document.documentElement.dataset.theme = next;
    document.body.dataset.qdTheme = next === "bright" ? "light" : "forest";
    document.documentElement.style.colorScheme = next === "bright" ? "light" : "dark";
    document.cookie = `qd-theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "bright" ? "#ffffff" : "#04100c");
  }
  return <div className="flex items-center gap-1 rounded-xl border border-qd-line bg-qd-card p-1" role="group" aria-label="Mavzu tanlash">
    {options.map((item) => <button key={item.id} type="button" aria-pressed={theme === item.id} onClick={() => chooseTheme(item.id)} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-green ${theme === item.id ? "border-qd-green bg-qd-card2 text-qd-text underline underline-offset-2" : "border-transparent text-qd-mute"}`}>
      {!compact && <span aria-hidden className="flex overflow-hidden rounded-full border border-current/30">{item.swatches.map((c) => <span key={c} className="h-3 w-3" style={{ backgroundColor: c }} />}</span>}{item.label}
    </button>)}
  </div>;
}
