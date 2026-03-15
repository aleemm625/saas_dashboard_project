import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center font-mono">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-100 mb-2">
          ✦ Welcome, {session.user?.name}
        </h1>
        <p className="text-slate-500 text-sm">{session.user?.email}</p>
        <p className="text-emerald-400 text-xs mt-4">
          ● Auth working · Dashboard coming next
        </p>
      </div>
    </div>
  );
}