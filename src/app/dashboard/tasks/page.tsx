import { db } from "@/lib/db";
import Link from "next/link";
import NewTaskModal from "@/components/NewTaskModal";

const statusConfig = {
  TODO: { label: "To Do", color: "text-slate-400", bg: "bg-[#1e293b]", dot: "bg-slate-400" },
  IN_PROGRESS: { label: "In Progress", color: "text-amber-400", bg: "bg-[#292219]", dot: "bg-amber-400" },
  DONE: { label: "Done", color: "text-emerald-400", bg: "bg-[#0f2920]", dot: "bg-emerald-400" },
};

const priorityConfig = {
  LOW: { label: "Low", color: "text-indigo-400" },
  MEDIUM: { label: "Medium", color: "text-amber-400" },
  HIGH: { label: "High", color: "text-red-400" },
};

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ boardId?: string }>;
}) {
  const { boardId } = await searchParams;

  const tasks = await db.task.findMany({
    where: boardId ? { boardId } : undefined,
    include: {
      board: { include: { team: true } },
      assignee: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const boards = await db.board.findMany({
    include: { team: true },
  });

  const grouped = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            {boardId
              ? `Board: ${boards.find((b) => b.id === boardId)?.name}`
              : "All tasks across your workspace"}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Board filter */}
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/dashboard/tasks"
              className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
                !boardId
                  ? "bg-[#1e1e35] border-indigo-500 text-indigo-400"
                  : "border-[#1e1e30] text-slate-500 hover:text-slate-300"
              }`}
            >
              All
            </Link>
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/dashboard/tasks?boardId=${board.id}`}
                className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
                  boardId === board.id
                    ? "bg-[#1e1e35] border-indigo-500 text-indigo-400"
                    : "border-[#1e1e30] text-slate-500 hover:text-slate-300"
                }`}
              >
                {board.name}
              </Link>
            ))}
          </div>
          <NewTaskModal boards={boards} />
        </div>
      </div>

      {/* Columns */}
      <div className="flex flex-col gap-6">
        {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => {
          const cfg = statusConfig[status];
          const colTasks = grouped[status];

          return (
            <div key={status}>
              {/* Column header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-bold tracking-widest ${cfg.color}`}>
                  {cfg.label.toUpperCase()}
                </span>
                <span className="text-xs text-slate-600 bg-[#1e1e30] px-2 py-0.5 rounded">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              {colTasks.length === 0 ? (
                <div className="border border-dashed border-[#1e1e30] rounded-xl p-6 text-center text-xs text-slate-700">
                  No tasks here
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                   {colTasks.map((task: typeof colTasks[number]) => {
                    const priority = priorityConfig[task.priority];
                    return (
                      <div
                        key={task.id}
                        className="bg-[#0f0f18] border border-[#1e1e30] rounded-xl px-5 py-4 flex items-center justify-between hover:bg-[#13131f] transition-colors"
                      >
                        {/* Left */}
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
                          <div>
                            <div className={`text-sm font-medium ${
                              task.status === "DONE"
                                ? "line-through text-slate-600"
                                : "text-slate-200"
                            }`}>
                              {task.title}
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              {task.board.name} · {task.board.team.name}
                            </div>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-bold ${priority.color}`}>
                            ● {priority.label}
                          </span>
                          {task.assignee ? (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ background: "#6366f1" }}
                              title={task.assignee.name ?? ""}
                            >
                              {task.assignee.name?.[0] ?? "?"}
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#1e1e30] flex items-center justify-center text-xs text-slate-600">
                              ?
                            </div>
                          )}
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-md ${cfg.bg} ${cfg.color}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}