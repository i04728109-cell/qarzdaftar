import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import "./themes.css";
import { PwaRegister } from "@/components/PwaRegister";
import { SiteStyleSwitcher } from "@/components/SiteStyleSwitcher";

export const metadata: Metadata = {
  title: "QarzDaftar",
  description: "Qarz unutilmaydi. Munosabat buzilmaydi.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "QarzDaftar", statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { themeColor: "#04100c", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("qd-theme")?.value === "bright" ? "bright" : "dark";
  return (
    <html lang="uz" data-theme={theme} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=document.cookie.match(/(?:^|; )qd-theme=([^;]+)/);document.documentElement.dataset.theme=t&&t[1]==='bright'?'bright':'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();` }} /></head>
      <body className="min-h-dvh bg-qd-bg font-sans text-qd-text antialiased" data-qd-theme={theme === "bright" ? "light" : "forest"}>
        <div className="fixed right-2 top-2 z-[100]"><SiteStyleSwitcher compact /></div>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}