import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Quizzes", href: "/admin/quizzes" },
    { name: "Questions", href: "/admin/questions" },
    { name: "Results", href: "/admin/results" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 border-r border-[var(--border)] hidden md:flex flex-col min-h-screen">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tighter uppercase">Quizzinga</h1>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                isActive ? "bg-white text-black" : "text-[var(--muted)] hover:text-white hover:bg-[var(--border)]"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-8 text-xs text-[var(--muted)] uppercase tracking-widest">
        Admin Panel v1.0
      </div>
    </aside>
  );
}
