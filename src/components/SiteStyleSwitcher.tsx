"use client";
import { useEffect, useState } from "react";

const themes = [
  { id: "forest", label: "Yashil", title: "Klassik yashil uslub" },
  { id: "light", label: "Oq", title: "Yorugʻ va sodda uslub" },
  { id: "ocean", label: "Koʻk", title: "Toʻq koʻk uslub" },
] as const;

type Theme = typeof themes[number]["id"];

export function SiteStyleSwitcher() {
  const [theme, setTheme] = useState<Theme>("forest");

  useEffect(() => {
    const saved = window.localStorage.getItem("qd-site-theme") as Theme | null;
    if (saved && themes.some((item) => item.id === saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    document.body.dataset.qdTheme = theme;
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f4f7f5" : theme === "ocean" ? "#071321" : "#04100c");
  }, [theme]);

  function chooseTheme(next: Theme) {
    setTheme(next);
    window.localStorage.setItem("qd-site-theme", next);
  }

  return <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/10 p-1" role="group" aria-label="Sayt uslubini tanlash">
    {themes.map((item) => <button key={item.id} type="button" title={item.title} aria-label={item.title} aria-pressed={theme === item.id} onClick={() => chooseTheme(item.id)} className={`rounded-lg border border-transparent px-2.5 py-2 text-[11px] font-bold transition sm:px-3 ${theme === item.id ? "bg-[#35d887] text-[#052014]" : "text-[#a7c0b1] hover:bg-white/10 hover:text-white"}`}>{item.label}</button>)}
  </div>;
}
