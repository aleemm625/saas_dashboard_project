import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">
          Good morning, {session?.user?.name?.split(" ")[0]} ✦
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's what's happening across your workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Teams", value: "3", icon: "◈", color: "text-indigo-400" },
          { label: "Boards", value: "5", icon: "▤", color: "text-amber-400" },
          { label: "Total Tasks", value: "8", icon: "✓", color: "text-emerald-400" },
          { label: "In Progress", value: "3", icon: "◎", color: "text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl p-5 relative overflow-hidden"
          >
            <div className={`text-xl mb-2 ${stat.color}`}>{stat.icon}</div>
            <div className="text-3xl font-black text-slate-100 leading-none">
              {stat.value}
            </div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl p-5">
          <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">
            RECENT TASKS
          </div>
          {[
            { title: "Design system tokens", status: "done", color: "text-emerald-400" },
            { title: "Auth flow implementation", status: "in-progress", color: "text-amber-400" },
            { title: "Database schema v2", status: "todo", color: "text-slate-400" },
            { title: "API rate limiting", status: "in-progress", color: "text-amber-400" },
            { title: "Onboarding screens", status: "todo", color: "text-slate-400" },
          ].map((task) => (
            <div
              key={task.title}
              className="flex items-center justify-between py-2.5 border-b border-[#1e1e30] last:border-0"
            >
              <span className="text-sm text-slate-300">{task.title}</span>
              <span className={`text-xs font-bold ${task.color}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl p-5">
          <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">
            ACTIVITY FEED
          </div>
          {[
            { user: "AS", action: "completed", target: "Design system tokens", time: "2m ago", color: "bg-indigo-500" },
            { user: "JK", action: "started", target: "Auth flow", time: "14m ago", color: "bg-amber-500" },
            { user: "PL", action: "created", target: "Onboarding screens", time: "1h ago", color: "bg-emerald-500" },
            { user: "MR", action: "assigned", target: "Database schema", time: "2h ago", color: "bg-red-500" },
            { user: "JK", action: "completed", target: "Dark mode toggle", time: "3h ago", color: "bg-amber-500" },
          ].map((log, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-[#1e1e30] last:border-0">
              <div className={`w-6 h-6 rounded-full ${log.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                {log.user}
              </div>
              <div>
                <span className="text-sm text-slate-400">
                  <span className="text-slate-200 font-bold">{log.user}</span>{" "}
                  {log.action}{" "}
                  <span className="text-indigo-400">{log.target}</span>
                </span>
                <div className="text-xs text-slate-600 mt-0.5">{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}