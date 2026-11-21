import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "QarzDaftar",
  description: "Qarz unutilmaydi. Munosabat buzilmaydi.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "QarzDaftar", statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { themeColor: "#04100c", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=document.cookie.match(/(?:^|; )qd-theme=([^;]+)/);document.documentElement.dataset.theme=t&&t[1]==='bright'?'bright':'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();` }} /></head>
      <body className="min-h-dvh bg-qd-bg font-sans text-qd-text antialiased" >
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}