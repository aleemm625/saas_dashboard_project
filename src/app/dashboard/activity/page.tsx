import { db } from "@/lib/db";

const typeColors: Record<string, string> = {
  completed: "text-emerald-400",
  started: "text-amber-400",
  created: "text-indigo-400",
  assigned: "text-slate-400",
};

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

const avatarColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export default async function ActivityPage() {
  const logs = await db.activityLog.findMany({
    include: { user: true, task: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Activity</h1>
        <p className="text-sm text-slate-500 mt-1">
          Recent actions across your workspace
        </p>
      </div>

      {/* Log */}
      <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-4">◎</div>
            <p className="text-slate-500 text-sm">No activity yet.</p>
          </div>
        ) : (
            logs.map((log: typeof logs[number], i: number) => {
            const avatarColor =
              avatarColors[
                log.user.name
                  ? log.user.name.charCodeAt(0) % avatarColors.length
                  : 0
              ];
            const actionColor =
              typeColors[log.action] ?? "text-slate-400";

            return (
              <div
                key={log.id}
                className={`flex items-start gap-4 px-6 py-4 ${
                  i < logs.length - 1 ? "border-b border-[#1e1e30]" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5"
                  style={{ background: avatarColor }}
                >
                  {log.user.name?.[0] ?? "?"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-400">
                    <span className="font-bold text-slate-200">
                      {log.user.name}
                    </span>{" "}
                    <span className={actionColor}>{log.action}</span>{" "}
                    <span className="text-indigo-400">{log.target}</span>
                  </div>
                  {log.task && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      Task: {log.task.title}
                    </div>
                  )}
                  <div className="text-xs text-slate-600 mt-1">
                    {timeAgo(log.createdAt)}
                  </div>
                </div>

                {/* Type badge */}
                <span className="text-xs text-slate-600 bg-[#1a1a28] px-2 py-1 rounded-md shrink-0 uppercase tracking-wide">
                  {log.action}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}