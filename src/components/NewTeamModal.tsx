"use client";

import { useState } from "react";
import { createTeam } from "@/lib/actions";

const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function NewTeamModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-bold px-4 py-2.5 rounded-lg"
      >
        + New Team
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-2xl p-8 w-[400px]">
            <h2 className="text-lg font-black text-slate-100 mb-6">New Team</h2>
            <form
              action={async (formData) => {
                await createTeam(formData);
                setOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-500 tracking-widest block mb-2">
                  TEAM NAME
                </label>
                <input
                  name="name"
                  placeholder="e.g. Engineering"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e30] rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 tracking-widest block mb-2">
                  COLOR
                </label>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <label key={c} className="cursor-pointer">
                      <input type="radio" name="color" value={c} className="sr-only" defaultChecked={c === "#6366f1"} />
                      <div
                        className="w-7 h-7 rounded-full border-2 border-transparent hover:scale-110 transition-transform"
                        style={{ background: c }}
                      />
                    </label>
                  ))}
                </div>
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}