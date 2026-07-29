import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation'
import DeleteAthleteButton from './DeleteAthleteButton'
import { Users, Activity, Target, ShieldAlert, Trophy, CalendarCheck } from 'lucide-react'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Athlete redirects
  if ((session.user as any).role === 'ATHLETE') {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }})
    if (user?.athleteId) {
      redirect(`/athletes/${user.athleteId}`)
    } else {
      return <div className="text-white p-8">Profil Atlet Anda belum disiapkan oleh Admin.</div>
    }
  }

  // Fetch all athletes with attendances
  const athletes = await prisma.athlete.findMany({
    include: {
      attendances: true,
      missions: true,
    }
  })

  // 1. Basic Stats
  const totalAthletes = athletes.length
  let averageRating = 0
  let overtrainingCount = 0
  let primeCount = 0

  if (totalAthletes > 0) {
    const totalRating = athletes.reduce((sum, a) => sum + a.overallRating, 0)
    averageRating = Math.round(totalRating / totalAthletes)
    overtrainingCount = athletes.filter(a => a.status === 'Injured' || a.status === 'Resting').length
    primeCount = athletes.filter(a => a.status === 'Active' || a.status === 'Prime').length
  }

  // 2. Attendance Calculations
  // Calculate attendance rate for each athlete
  const athletesWithAttendance = athletes.map(athlete => {
    const totalDaysRecorded = athlete.attendances.length
    const daysPresent = athlete.attendances.filter(a => a.isPresent).length
    const attendanceRate = totalDaysRecorded === 0 ? 0 : Math.round((daysPresent / totalDaysRecorded) * 100)
    return {
      ...athlete,
      attendanceRate,
      totalDaysRecorded
    }
  })

  const topAttendees = [...athletesWithAttendance]
    .filter(a => a.totalDaysRecorded > 0)
    .sort((a, b) => b.attendanceRate - a.attendanceRate)
    .slice(0, 5)

  const topPerformers = [...athletesWithAttendance]
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 5)

  // 3. Class Group Analysis (Prestasi vs Reguler)
  const prestasiGroup = athletesWithAttendance.filter(a => a.classGroup === "Prestasi")
  const regulerGroup = athletesWithAttendance.filter(a => a.classGroup === "Reguler")
  
  const getGroupAvg = (group: any[]) => group.length > 0 ? Math.round(group.reduce((sum, a) => sum + a.overallRating, 0) / group.length) : 0
  const getGroupAtt = (group: any[]) => group.length > 0 ? Math.round(group.reduce((sum, a) => sum + a.attendanceRate, 0) / group.length) : 0

  const prestasiAvg = getGroupAvg(prestasiGroup)
  const regulerAvg = getGroupAvg(regulerGroup)
  const prestasiAtt = getGroupAtt(prestasiGroup)
  const regulerAtt = getGroupAtt(regulerGroup)

  // 4. Top by Weight Class
  const weightClasses = Array.from(new Set(athletesWithAttendance.map(a => a.weightClass)))
  const topPerWeightClass = weightClasses.map(wc => {
    const athletesInClass = athletesWithAttendance.filter(a => a.weightClass === wc)
    athletesInClass.sort((a, b) => b.overallRating - a.overallRating)
    return athletesInClass[0]
  }).sort((a, b) => b.overallRating - a.overallRating)

  return (
    <div className="w-full space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Command Center</h1>
        <p className="text-slate-400 mt-1">Analisis performa, kedisiplinan, dan kondisi tim secara real-time.</p>
      </div>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-cyan-500/10 group-hover:scale-110 transition-transform">
            <Trophy className="w-24 h-24" />
          </div>
          <h3 className="text-slate-400 font-medium text-sm mb-2">Team Average Rating</h3>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-white">{averageRating}</p>
            <p className="text-slate-500 font-medium mb-1">/99</p>
          </div>
          <p className="text-cyan-400 text-xs mt-2 font-medium">Berdasarkan {totalAthletes} atlet aktif</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:scale-110 transition-transform">
            <CalendarCheck className="w-24 h-24" />
          </div>
          <h3 className="text-slate-400 font-medium text-sm mb-2">Avg Attendance Rate</h3>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-white">{athletesWithAttendance.length > 0 ? getGroupAtt(athletesWithAttendance) : 0}</p>
            <p className="text-slate-500 font-medium mb-1">%</p>
          </div>
          <p className="text-emerald-400 text-xs mt-2 font-medium">Tingkat kedisiplinan tim</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-blue-500/10 group-hover:scale-110 transition-transform">
            <Activity className="w-24 h-24" />
          </div>
          <h3 className="text-slate-400 font-medium text-sm mb-2">Prime Condition</h3>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-white">{primeCount}</p>
          </div>
          <p className="text-blue-400 text-xs mt-2 font-medium">Atlet siap tempur</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-rose-900/40 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-rose-500/10 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-24 h-24" />
          </div>
          <h3 className="text-slate-400 font-medium text-sm mb-2">Overtraining / Injured</h3>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-rose-500">{overtrainingCount}</p>
          </div>
          <p className={overtrainingCount === 0 ? "text-emerald-400 text-xs mt-2 font-medium" : "text-rose-400 text-xs mt-2 font-medium"}>
            {overtrainingCount === 0 ? "Aman dari cedera" : "Perlu recovery segera"}
          </p>
        </div>
      </div>

      {/* Row 2: Class Analysis */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Komparasi Kelas (Prestasi vs Reguler)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kelas Prestasi */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-amber-500/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-amber-400">Kelas Prestasi</h3>
              <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">{prestasiGroup.length} Atlet</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Rata-rata Rating (Skill)</span>
                  <span className="font-bold text-white">{prestasiAvg}/99</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${prestasiAvg}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Tingkat Kehadiran</span>
                  <span className="font-bold text-white">{prestasiAtt}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${prestasiAtt}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Kelas Reguler */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-400">Kelas Reguler</h3>
              <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">{regulerGroup.length} Atlet</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Rata-rata Rating (Skill)</span>
                  <span className="font-bold text-white">{regulerAvg}/99</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${regulerAvg}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Tingkat Kehadiran</span>
                  <span className="font-bold text-white">{regulerAtt}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${regulerAtt}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Leaderboards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Top Performers (Skill) */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" /> Top Performers
            </h2>
            <span className="text-xs text-slate-400">Berdasarkan Rating</span>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-slate-900/50 text-slate-400">
                <tr>
                  <th className="py-3 px-5 font-medium">Atlet</th>
                  <th className="py-3 px-5 font-medium text-center">Kelas</th>
                  <th className="py-3 px-5 font-medium text-center">Rating</th>
                  <th className="py-3 px-5 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {topPerformers.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-slate-500">Belum ada data</td></tr>
                )}
                {topPerformers.map((athlete, idx) => (
                  <tr key={athlete.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{athlete.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center text-slate-400">{athlete.classGroup}</td>
                    <td className="py-3 px-5 text-center">
                      <span className="font-bold text-cyan-400">{athlete.overallRating}</span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Link href={`/athletes/${athlete.id}`} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 bg-cyan-500/10 rounded-lg">
                        Analyze
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Dedicated (Attendance) */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-400" /> Most Dedicated
            </h2>
            <span className="text-xs text-slate-400">Berdasarkan Kehadiran</span>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[400px]">
              <thead className="bg-slate-900/50 text-slate-400">
                <tr>
                  <th className="py-3 px-5 font-medium">Atlet</th>
                  <th className="py-3 px-5 font-medium text-center">Kehadiran</th>
                  <th className="py-3 px-5 font-medium text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {topAttendees.length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-center text-slate-500">Belum ada data absen</td></tr>
                )}
                {topAttendees.map((athlete, idx) => (
                  <tr key={athlete.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{athlete.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center text-slate-400">
                      {athlete.attendances.filter(a => a.isPresent).length} / {athlete.totalDaysRecorded} Hari
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        athlete.attendanceRate >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                        athlete.attendanceRate >= 50 ? 'bg-amber-500/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {athlete.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Top by Weight Class */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden flex flex-col xl:col-span-2">
          <div className="p-5 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-400" /> Kings of the Weight Class
            </h2>
            <span className="text-xs text-slate-400">Atlet Terbaik di Tiap Kelas Berat</span>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-slate-900/50 text-slate-400">
                <tr>
                  <th className="py-3 px-5 font-medium">Kelas Berat (Weight Class)</th>
                  <th className="py-3 px-5 font-medium">Atlet Terbaik</th>
                  <th className="py-3 px-5 font-medium text-center">Grup Kelas</th>
                  <th className="py-3 px-5 font-medium text-center">Rating</th>
                  <th className="py-3 px-5 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {topPerWeightClass.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-500">Belum ada data</td></tr>
                )}
                {topPerWeightClass.map((athlete) => (
                  <tr key={athlete.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 px-5 font-bold text-purple-400">{athlete.weightClass}</td>
                    <td className="py-3 px-5 font-bold text-slate-200">{athlete.name}</td>
                    <td className="py-3 px-5 text-center text-slate-400">{athlete.classGroup}</td>
                    <td className="py-3 px-5 text-center">
                      <span className="font-bold text-cyan-400">{athlete.overallRating}</span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Link href={`/athletes/${athlete.id}`} className="text-xs font-bold text-purple-400 hover:text-purple-300 px-3 py-1.5 bg-purple-500/10 rounded-lg transition-colors">
                        Analyze
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
