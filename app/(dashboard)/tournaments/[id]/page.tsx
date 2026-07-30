import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import { notFound } from 'next/navigation'
import { ChevronLeft, Trophy, CalendarDays, MapPin, Swords, Users } from 'lucide-react'
import AddMatchModal from './AddMatchModal'
import ManageParticipantsModal from './ManageParticipantsModal'
import MedalSelector from './MedalSelector'

export default async function TournamentDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: {
      participants: {
        include: {
          athlete: true
        }
      },
      matches: {
        include: {
          athlete: true
        },
        orderBy: {
          date: 'desc'
        }
      }
    }
  })

  if (!tournament) {
    notFound()
  }

  const allAthletes = await prisma.athlete.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, weightClass: true }
  })

  // Get only athletes that are participating
  const participatingAthletes = tournament.participants.map(p => p.athlete)
  const participantIds = participatingAthletes.map(a => a.id)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
      <Link href="/tournaments" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Tournaments
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              {tournament.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <CalendarDays className="w-4 h-4 text-cyan-500" />
                <span>{formatDate(tournament.date)}</span>
              </div>
              {tournament.location && (
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span>{tournament.location}</span>
                </div>
              )}
            </div>
            
            {tournament.description && (
              <p className="text-slate-300 max-w-3xl mt-4">{tournament.description}</p>
            )}
          </div>

          {isAdmin && (
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <ManageParticipantsModal 
                tournamentId={tournament.id} 
                allAthletes={allAthletes} 
                initialSelectedIds={participantIds} 
              />
              <AddMatchModal tournamentId={tournament.id} athletes={participatingAthletes} />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-500" />
          Participants ({participatingAthletes.length})
        </h2>

        {tournament.participants.length === 0 ? (
          <div className="py-6 text-center bg-slate-900 border border-slate-800 rounded-3xl">
            <p className="text-slate-500">Belum ada atlet yang didaftarkan ke turnamen ini.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tournament.participants.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-4 shadow-sm hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0">
                    {p.athlete.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-sm leading-tight">{p.athlete.name}</div>
                    <div className="text-xs text-slate-500">{p.athlete.weightClass}</div>
                  </div>
                </div>
                {isAdmin ? (
                  <div className="pl-4 border-l border-slate-800">
                    <MedalSelector tournamentId={tournament.id} participantId={p.id} initialMedal={p.medal} />
                  </div>
                ) : p.medal ? (
                  <div className={`pl-4 border-l border-slate-800 text-xs font-bold ${
                    p.medal === "Emas" ? "text-yellow-500" :
                    p.medal === "Perak" ? "text-slate-300" :
                    p.medal === "Perunggu" ? "text-amber-600" : "text-slate-400"
                  }`}>
                    {p.medal === "Emas" ? "🥇 Emas" : p.medal === "Perak" ? "🥈 Perak" : "🥉 Perunggu"}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Swords className="w-6 h-6 text-cyan-500" />
          Match Results ({tournament.matches.length})
        </h2>

        {tournament.matches.length === 0 ? (
          <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
            <Swords className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">Belum ada hasil pertandingan yang dicatat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournament.matches.map(match => (
              <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      match.result === 'Win' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {match.result}
                    </span>
                    <div className="flex items-center gap-3 text-lg font-bold text-white">
                      <span>{match.athlete.name}</span>
                      <span className="text-slate-500 text-sm font-normal">vs</span>
                      <span className="text-slate-300">{match.opponentName}</span>
                    </div>
                  </div>
                  {match.score && (
                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                      <span className="text-cyan-400 font-bold">{match.score}</span>
                    </div>
                  )}
                </div>

                {match.round && (
                  <div className="text-sm font-medium text-slate-400 mb-3">
                    Babak: <span className="text-slate-200">{match.round}</span>
                  </div>
                )}

                {match.notes && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mt-4">
                    <p className="text-sm text-slate-300 italic">"{match.notes}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
