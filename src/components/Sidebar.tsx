"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/dashboard/teams", icon: "◈", label: "Teams" },
  { href: "/dashboard/boards", icon: "▤", label: "Boards" },
  { href: "/dashboard/tasks", icon: "✓", label: "Tasks" },
  { href: "/dashboard/activity", icon: "◎", label: "Activity" },
  { href: "/dashboard/admin", icon: "⚙", label: "Admin" },
];

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Sidebar({ user }: { user?: User }) {
  const pathname = usePathname();

  return (
    <div className="w-[220px] bg-[#0f0f18] border-r border-[#1e1e30] flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#1e1e30]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-sm font-black text-white">
            N
          </div>
          <span className="text-sm font-bold tracking-widest text-slate-100">
            NOTIONLIKE
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2 ${
                isActive
                  ? "bg-[#1e1e35] text-indigo-400 border-indigo-500 font-bold"
                  : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#13131f]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-t border-[#1e1e30] flex items-center gap-3">
        {user?.image ? (
          <img
            src={user.image}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0] ?? "?"}
          </div>
        )}
        <div>
          <div className="text-xs font-bold text-slate-200">{user?.name}</div>
          <div className="text-xs text-slate-500">Admin</div>
        </div>
      </div>

    </div>
  );
}