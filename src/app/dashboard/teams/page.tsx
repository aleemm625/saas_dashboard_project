import { db } from "@/lib/db";
import Link from "next/link";

export default async function TeamsPage() {
  const teams = await db.team.findMany({
    include: {
      _count: {
        select: { members: true, boards: true },
      },
    },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Teams</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your workspace teams</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-bold px-4 py-2.5 rounded-lg">
          + New Team
        </button>
      </div>

      {/* Teams grid */}
      {teams.length === 0 ? (
        <div className="bg-[#0f0f18] border border-dashed border-[#1e1e30] rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">◈</div>
          <p className="text-slate-500 text-sm">No teams yet.</p>
          <p className="text-slate-600 text-xs mt-1">Create your first team to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/dashboard/boards?teamId=${team.id}`}
              className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl p-6 hover:bg-[#13131f] transition-colors group"
              style={{ borderTop: `3px solid ${team.color}` }}
            >
              <div className="text-2xl mb-3">◈</div>
              <div className="text-base font-black text-slate-100 mb-1">{team.name}</div>
              <div className="text-xs text-slate-500">{team._count.members} members</div>
              <div className="text-xs text-slate-500 mt-0.5">{team._count.boards} boards</div>
              <div
                className="text-xs font-bold mt-4 tracking-wide"
                style={{ color: team.color }}
              >
                VIEW BOARDS →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}