"use client";
import { useEffect, useState } from "react";
type Theme = "dark" | "bright";
export function SiteStyleSwitcher({ compact = false }: { compact?: boolean }) {
 const [theme, setTheme] = useState<Theme>("dark");
 useEffect(() => {
  const saved = localStorage.getItem("qd-theme");
  const initial: Theme = saved === "bright" ? "bright" : document.documentElement.dataset.theme === "bright" ? "bright" : "dark";
  setTheme(initial); document.documentElement.dataset.theme = initial;
  document.body.dataset.qdTheme = initial === "bright" ? "light" : "forest";
  document.documentElement.style.colorScheme = initial === "bright" ? "light" : "dark";
 }, []);
 function chooseTheme() {
  const next: Theme = theme === "dark" ? "bright" : "dark";
  setTheme(next); localStorage.setItem("qd-theme", next);
  document.documentElement.dataset.theme = next; document.body.dataset.qdTheme = next === "bright" ? "light" : "forest";
  document.documentElement.style.colorScheme = next === "bright" ? "light" : "dark";
  document.cookie = "qd-theme=" + next + "; Path=/; Max-Age=31536000; SameSite=Lax";
  fetch("/api/profile/theme", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme: next }) }).catch(() => {});
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "bright" ? "#ffffff" : "#04100c");
 }
 const bright = theme === "bright";
 return (
  <button type="button" onClick={chooseTheme} aria-label={bright ? "Qorongʻi mavzuga oʻtish" : "Yorqin mavzuga oʻtish"} aria-pressed={bright}
   className="inline-flex items-center gap-2 rounded-full border border-qd-line bg-qd-card px-3 py-2 text-sm font-semibold text-qd-text shadow-sm transition hover:border-qd-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-qd-green">
  <span className="relative flex h-5 w-9 items-center rounded-full bg-qd-card2 p-0.5 ring-1 ring-qd-line">
   <span className={"h-4 w-4 rounded-full bg-qd-green shadow-sm transition-transform " + (bright ? "translate-x-4" : "translate-x-0")} />
  </span>
  <span>{bright ? "Yorqin" : "Asosiy"}</span>
 </button>
 );
}
