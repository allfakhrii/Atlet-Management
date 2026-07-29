import Link from 'next/link'
import { LayoutDashboard, Users, Activity, Settings, Dumbbell } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Coach Hub
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-cyan-400 rounded-xl transition-colors border border-slate-700/50">
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Overview</span>
        </Link>
        <Link href="/athletes/dummy" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors">
          <Users className="w-5 h-5" />
          <span className="font-medium">Athletes Profile</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Training Logs</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  )
}
