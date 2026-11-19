import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthCard } from "@/components/AuthCard";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    redirect(isAdmin === true ? "/admin" : (next || "/app"));
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-block text-2xl font-black tracking-tight">Qarz<span className="text-qd-green">Daftar</span></Link>
        <div className="mb-5"><h1 className="text-2xl font-extrabold">Hisobingizga kiring</h1><p className="mt-2 text-sm text-qd-mute">Yangi foydalanuvchi boʻlsangiz, roʻyxatdan oʻtish boʻlimini tanlang.</p></div>
        <Suspense><AuthCard initial="login" /></Suspense>
        <p className="mt-5 text-center text-sm text-qd-mute"><Link href="/" className="text-emerald-300 hover:underline">← Bosh sahifaga qaytish</Link></p>
      </div>
    </main>
  );
}
