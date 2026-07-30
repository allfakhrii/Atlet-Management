"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, Activity, Target, ShieldCheck, ClipboardList, Trophy } from "lucide-react";
import LogoutButton from "../auth/LogoutButton";

export default function MobileNav({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = role === "ADMIN" 
    ? [
        { name: "Command Center", href: "/", icon: LayoutDashboard },
        { name: "Athlete Directory", href: "/athletes", icon: Users },
        { name: "Approvals", href: "/approvals", icon: ShieldCheck },
        { name: "Attendance", href: "/attendance", icon: ClipboardList },
        { name: "Tournaments", href: "/tournaments", icon: Trophy },
        { name: "Training Logs", href: "/training-logs", icon: Activity },
      ]
    : [
        { name: "My Profile", href: "/", icon: LayoutDashboard },
        { name: "Missions", href: "/missions", icon: Target },
      ];

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-white transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative flex flex-col w-64 max-w-sm h-full bg-slate-900 border-r border-slate-800 p-6 animate-in slide-in-from-left">
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                {role === "ADMIN" ? "Coach Hub" : "Athlete Hub"}
              </h1>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-400' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto border-t border-slate-800 pt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
