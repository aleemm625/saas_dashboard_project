"use client";

import { useState } from "react";
import { createTask } from "@/lib/actions";

type Board = { id: string; name: string };

export default function NewTaskModal({ boards }: { boards: Board[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-bold px-4 py-2 rounded-lg"
      >
        + New Task
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-2xl p-8 w-[400px]">
            <h2 className="text-lg font-black text-slate-100 mb-6">New Task</h2>
            <form
              action={async (formData) => {
                await createTask(formData);
                setOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-500 tracking-widest block mb-2">
                  TASK TITLE
                </label>
                <input
                  name="title"
                  placeholder="e.g. Fix login bug"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e30] rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 tracking-widest block mb-2">
                  BOARD
                </label>
                <select
                  name="boardId"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e30] rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select a board...</option>
                  {boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 tracking-widest block mb-2">
                  PRIORITY
                </label>
                <select
                  name="priority"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e30] rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM" selected>Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#1e1e30] text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-bold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}