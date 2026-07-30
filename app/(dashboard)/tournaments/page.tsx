import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import { Trophy, CalendarDays, MapPin, ChevronRight } from 'lucide-react'
import AddTournamentModal from './AddTournamentModal'

export default async function TournamentsPage() {
  const session = await getServerSession(authOptions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const tournaments = await prisma.tournament.findMany({
    orderBy: { date: 'desc' },
    include: {
      matches: true
    }
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-cyan-400" />
            Tournaments
          </h1>
          <p className="text-slate-400 mt-1">Lacak partisipasi dan hasil pertandingan di berbagai kejuaraan.</p>
        </div>
        
        {isAdmin && (
          <AddTournamentModal />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
            <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">Belum ada turnamen yang ditambahkan.</p>
          </div>
        )}

        {tournaments.map((tournament) => (
          <Link 
            href={`/tournaments/${tournament.id}`}
            key={tournament.id} 
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all group flex flex-col h-full shadow-xl"
          >
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {tournament.name}
                </h2>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays className="w-4 h-4 text-cyan-500" />
                  <span>{formatDate(tournament.date)}</span>
                </div>
                {tournament.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span className="truncate">{tournament.location}</span>
                  </div>
                )}
              </div>
              
              {tournament.description && (
                <p className="text-sm text-slate-500 line-clamp-2">{tournament.description}</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-300">
                <span className="text-cyan-400 text-lg font-bold mr-1">{tournament.matches.length}</span> 
                Matches
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
