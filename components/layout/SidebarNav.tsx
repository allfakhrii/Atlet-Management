"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Activity, ShieldCheck, Target, ClipboardList } from 'lucide-react'

export default function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return pathname === path;
  }

  const linkClass = (path: string) => 
    isActive(path)
      ? "flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-cyan-400 rounded-xl transition-colors border border-slate-700/50"
      : "flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors border border-transparent"

  return (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {role === "ADMIN" ? (
        <>
          <Link href="/" className={linkClass("/")}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/athletes" className={linkClass("/athletes")}>
            <Users className="w-5 h-5" />
            <span className="font-medium">Athletes</span>
          </Link>
          <Link href="/approvals" className={linkClass("/approvals")}>
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium">Approvals</span>
          </Link>
          <Link href="/attendance" className={linkClass("/attendance")}>
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">Attendance</span>
          </Link>
        </>
      ) : (
        <Link href="/" className={linkClass("/")}>
          <Users className="w-5 h-5" />
          <span className="font-medium">My Profile</span>
        </Link>
      )}

      <Link href="/training-logs" className={linkClass("/training-logs")}>
        <Activity className="w-5 h-5" />
        <span className="font-medium">Training Logs</span>
      </Link>
      
      <Link href="/missions" className={linkClass("/missions")}>
        <Target className="w-5 h-5" />
        <span className="font-medium">Missions</span>
      </Link>
    </nav>
  )
}
