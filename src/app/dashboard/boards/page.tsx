import { db } from "@/lib/db";
import Link from "next/link";

export default async function BoardsPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const { teamId } = await searchParams;

  const boards = await db.board.findMany({
    where: teamId ? { teamId } : undefined,
    include: {
      team: true,
      _count: { select: { tasks: true } },
      tasks: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const teams = await db.team.findMany();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Boards</h1>
          <p className="text-sm text-slate-500 mt-1">
            {teamId
              ? `Filtered by: ${teams.find((t) => t.id === teamId)?.name}`
              : "All boards across your workspace"}
          </p>
        </div>
        <div className="flex gap-3">
          {/* Team filter */}
          <div className="flex gap-2">
            <Link
              href="/dashboard/boards"
              className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
                !teamId
                  ? "bg-[#1e1e35] border-indigo-500 text-indigo-400"
                  : "border-[#1e1e30] text-slate-500 hover:text-slate-300"
              }`}
            >
              All
            </Link>
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/dashboard/boards?teamId=${team.id}`}
                className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
                  teamId === team.id
                    ? "bg-[#1e1e35] border-indigo-500 text-indigo-400"
                    : "border-[#1e1e30] text-slate-500 hover:text-slate-300"
                }`}
              >
                {team.name}
              </Link>
            ))}
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-bold px-4 py-2 rounded-lg">
            + New Board
          </button>
        </div>
      </div>

      {/* Boards grid */}
      {boards.length === 0 ? (
        <div className="bg-[#0f0f18] border border-dashed border-[#1e1e30] rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">▤</div>
          <p className="text-slate-500 text-sm">No boards yet.</p>
          <p className="text-slate-600 text-xs mt-1">Create your first board to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {boards.map((board) => {
            const done = board.tasks.filter((t) => t.status === "DONE").length;
            const total = board._count.tasks;
            const pct = total ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                key={board.id}
                href={`/dashboard/tasks?boardId=${board.id}`}
                className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl p-6 hover:bg-[#13131f] transition-colors block"
              >
                {/* Team badge */}
                <div
                  className="inline-block text-xs font-bold px-2 py-0.5 rounded mb-3"
                  style={{
                    background: board.team.color + "22",
                    color: board.team.color,
                  }}
                >
                  {board.team.name}
                </div>

                {/* Board name */}
                <div className="text-base font-black text-slate-100 mb-4">
                  {board.name}
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-[#1e1e30] rounded-full mb-2">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{total} tasks</span>
                  <span className="text-emerald-400">{pct}% done</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}