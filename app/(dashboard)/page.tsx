import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import DeleteAthleteButton from './DeleteAthleteButton'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Jika yang login atlet, lempar ke profilnya sendiri
  if ((session.user as any).role === 'ATHLETE') {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }})
    if (user?.athleteId) {
      redirect(`/athletes/${user.athleteId}`)
    } else {
      return <div className="text-white p-8">Profil Atlet Anda belum disiapkan oleh Admin.</div>
    }
  }

  // Ambil semua data atlet dari Neon Database (Khusus Admin)
  const athletes = await prisma.athlete.findMany({
    orderBy: { overallRating: 'desc' },
    take: 5
  })

  let averageRating = 0;
  let primeCount = 0;
  let overtrainingCount = 0;

  if (athletes.length > 0) {
    const totalRating = athletes.reduce((sum, athlete) => sum + athlete.overallRating, 0);
    averageRating = Math.round(totalRating / athletes.length);
    primeCount = athletes.filter(a => a.status === 'Active' || a.status === 'Prime').length;
    // Asumsi sederhana: jika status Injured atau Resting, masuk risk alert.
    overtrainingCount = athletes.filter(a => a.status === 'Injured' || a.status === 'Resting').length;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Overview Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, Coach Rizal. Here's what's happening with your team today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 className="text-slate-400 font-medium">Team Average Rating</h3>
          <p className="text-4xl font-black text-white mt-2">{averageRating}<span className="text-xl text-slate-500 font-medium">/99</span></p>
          <p className="text-emerald-400 text-sm mt-2 font-medium">{athletes.length > 0 ? "Berdasarkan roster saat ini" : "Belum ada atlet"}</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 className="text-slate-400 font-medium">Athletes in Prime</h3>
          <p className="text-4xl font-black text-white mt-2">{primeCount}</p>
          <p className="text-slate-400 text-sm mt-2 font-medium">Out of {athletes.length} roster</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-rose-900/40 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 className="text-slate-400 font-medium">Overtraining Risk Alerts</h3>
          <p className="text-4xl font-black text-rose-500 mt-2">{overtrainingCount}</p>
          <p className={overtrainingCount === 0 ? "text-emerald-400 text-sm mt-2 font-medium" : "text-rose-400 text-sm mt-2 font-medium"}>
            {overtrainingCount === 0 ? "All good" : "Perlu perhatian khusus!"}
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-700/60 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Top Athletes Leaderboard</h2>
          <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-sm">
              <tr>
                <th className="py-4 px-6 font-medium">Athlete</th>
                <th className="py-4 px-6 font-medium">Weight Class</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Overall</th>
                <th className="py-4 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {athletes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No athletes found in database.
                  </td>
                </tr>
              )}
              {athletes.map((athlete) => (
                <tr key={athlete.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold text-sm">
                        {athlete.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-200">{athlete.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{athlete.weightClass}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">{athlete.status}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-cyan-400">{athlete.overallRating}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end">
                      <Link href={`/athletes/${athlete.id}`} className="text-sm font-medium bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Analyze
                      </Link>
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
