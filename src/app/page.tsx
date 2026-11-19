import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthCard } from "@/components/AuthCard";

const FEATURES = [
  "Mijozlar va qarzlarni bir joyda yuriting",
  "Toʻlovlar va muddatlar avtomatik eslatiladi",
  "Telefondan ilovadek ishlaydi",
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    redirect(isAdmin === true ? "/admin" : "/app");
  }
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-8">
      <header>
        <h1 className="text-4xl font-extrabold">Qarz<span className="text-qd-green">Daftar</span></h1>
        <p className="mt-1 text-sm text-qd-mute">Qarz unutilmaydi. Munosabat buzilmaydi.</p>
      </header>
      <ul className="flex flex-col gap-2 text-sm">
        {FEATURES.map((t) => <li key={t} className="rounded-xl border border-qd-line bg-qd-card px-3 py-2">✓ {t}</li>)}
      </ul>
      <Suspense><AuthCard /></Suspense>
      <p className="text-center text-xs text-qd-mute">Roʻyxatdan oʻtish bepul. Ilovadan foydalanish uchun obuna kerak.</p>
    </main>
  );
}
