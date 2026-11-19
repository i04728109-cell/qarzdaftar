import { redirect } from "next/navigation";

// Login now lives on the home page; keep the old URL working.
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  redirect(next ? `/?next=${encodeURIComponent(next)}` : "/");
}
