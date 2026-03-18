import { db } from "@/lib/db";
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  const [users, teams, tasks] = await Promise.all([
    db.user.findMany({
      include: {
        teamMemberships: { include: { team: true } },
        _count: { select: { assignedTasks: true } },
      },
    }),
    db.team.findMany({
      include: {
        _count: { select: { members: true, boards: true } },
      },
    }),
    db.task.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const avatarColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Admin Panel</h1>
        <p className="text-sm text-slate-500 mt-1">Workspace settings and management</p>
      </div>

      <div className="flex flex-col gap-8">

        {/* Users */}
        <div>
          <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">USERS</div>
          <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 px-6 py-3 border-b border-[#1e1e30] text-xs font-bold text-slate-600 tracking-widest">
              <span>USER</span>
              <span>ROLE</span>
              <span>TEAMS</span>
              <span>TASKS</span>
            </div>
            {users.map((user, i) => {
              const color = avatarColors[user.name ? user.name.charCodeAt(0) % avatarColors.length : 0];
              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-4 px-6 py-4 items-center ${
                    i < users.length - 1 ? "border-b border-[#1e1e30]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: color }}
                    >
                      {user.name?.[0] ?? "?"}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                      <div className="text-xs text-slate-600">{user.email}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${
                    user.role === "ADMIN" ? "text-indigo-400" : "text-slate-500"
                  }`}>
                    {user.role}
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {user.teamMemberships.length === 0 ? (
                      <span className="text-xs text-slate-600">No teams</span>
                    ) : (
                      user.teamMemberships.map((m) => (
                        <span
                          key={m.teamId}
                          className="text-xs px-2 py-0.5 rounded font-bold"
                          style={{
                            background: m.team.color + "22",
                            color: m.team.color,
                          }}
                        >
                          {m.team.name}
                        </span>
                      ))
                    )}
                  </div>
                  <span className="text-sm text-slate-400 font-bold">
                    {user._count.assignedTasks} tasks
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teams */}
        <div>
          <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">TEAMS</div>
          <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl overflow-hidden">
            {teams.map((team, i) => (
              <div
                key={team.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  i < teams.length - 1 ? "border-b border-[#1e1e30]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: team.color }}
                  />
                  <span className="text-sm font-bold text-slate-200">{team.name}</span>
                </div>
                <div className="flex gap-6 text-xs text-slate-500">
                  <span>{team._count.members} members</span>
                  <span>{team._count.boards} boards</span>
                  <button className="text-red-400 hover:text-red-300 transition-colors font-bold">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task stats */}
        <div>
          <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">TASK OVERVIEW</div>
          <div className="grid grid-cols-3 gap-4">
            {tasks.map((stat) => {
              const colors: Record<string, string> = {
                TODO: "text-slate-400",
                IN_PROGRESS: "text-amber-400",
                DONE: "text-emerald-400",
              };
              return (
                <div
                  key={stat.status}
                  className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl p-5"
                >
                  <div className={`text-2xl font-black ${colors[stat.status]}`}>
                    {stat._count}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {stat.status.replace("_", " ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session info */}
        <div>
          <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">CURRENT SESSION</div>
          <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl p-5 flex items-center gap-4">
            {session?.user?.image && (
              <img src={session.user.image} className="w-10 h-10 rounded-full" alt="avatar" />
            )}
            <div>
              <div className="text-sm font-bold text-slate-200">{session?.user?.name}</div>
              <div className="text-xs text-slate-500">{session?.user?.email}</div>
            </div>
            <span className="ml-auto text-xs font-bold text-emerald-400">● Active</span>
          </div>
        </div>

      </div>
    </div>
  );
}