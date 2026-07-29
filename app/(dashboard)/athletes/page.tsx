import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation'
import DeleteAthleteButton from '../DeleteAthleteButton'
import EditAthleteButton from './EditAthleteButton'
import { Users, Search } from 'lucide-react'

export default async function AthletesDirectory() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect('/login')
  }

  // Fetch all athletes
  const athletes = await prisma.athlete.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-400" />
            Athlete Directory
          </h1>
          <p className="text-slate-400 mt-1">Kelola seluruh daftar atlet di akademi Anda.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Cari atlet..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-950 text-slate-400 text-sm border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-medium">Atlet</th>
                <th className="py-4 px-6 font-medium">Grup Kelas</th>
                <th className="py-4 px-6 font-medium">Usia & Berat</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Rating</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {athletes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Belum ada atlet yang terdaftar di sistem.
                  </td>
                </tr>
              )}
              {athletes.map((athlete: any) => (
                <tr key={athlete.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm">
                        {athlete.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-200 block">{athlete.name}</span>
                        <span className="text-xs text-slate-500">ID: {athlete.id.substring(0,8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      athlete.classGroup === 'Prestasi' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {athlete.classGroup}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-300">{athlete.age} Tahun</div>
                    <div className="text-xs text-slate-500">{athlete.weightClass}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      athlete.status === 'Active' || athlete.status === 'Prime' ? 'bg-emerald-500/10 text-emerald-400' :
                      athlete.status === 'Injured' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {athlete.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-sm border border-slate-700">
                        {athlete.overallRating}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/athletes/${athlete.id}`} className="text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2.5 rounded-xl transition-colors border border-cyan-500/20">
                        Analyze
                      </Link>
                      <EditAthleteButton athlete={athlete as any} />
                      <DeleteAthleteButton id={athlete.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
