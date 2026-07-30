"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, CalendarCheck } from 'lucide-react'

export default function DashboardLeaderboards({ athletesWithAttendance }: { athletesWithAttendance: any[] }) {
  const [activeTab, setActiveTab] = useState<'putra' | 'putri'>('putra')

  const filteredAthletes = athletesWithAttendance.filter(a => activeTab === 'putra' ? (a.gender === 'Laki-laki' || !a.gender) : a.gender === 'Perempuan')

  const topPerformers = [...filteredAthletes]
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 5)

  const topAttendees = [...filteredAthletes]
    .filter(a => a.totalDaysRecorded > 0)
    .sort((a, b) => b.attendanceRate - a.attendanceRate)
    .slice(0, 5)

  const weightClasses = Array.from(new Set(filteredAthletes.map((a: any) => a.weightClass)))
  const topPerWeightClass = weightClasses.map((wc: any) => {
    const athletesInClass = filteredAthletes.filter((a: any) => a.weightClass === wc)
    athletesInClass.sort((a: any, b: any) => b.overallRating - a.overallRating)
    return athletesInClass[0]
  }).sort((a: any, b: any) => b.overallRating - a.overallRating)

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-700/50 inline-flex shadow-lg">
          <button
            onClick={() => setActiveTab('putra')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'putra' 
                ? 'bg-cyan-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Laki-laki (Putra)
          </button>
          <button
            onClick={() => setActiveTab('putri')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'putri' 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Perempuan (Putri)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Performers (Skill) */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${activeTab === 'putra' ? 'text-cyan-400' : 'text-purple-400'}`} /> Top Performers
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
                {topPerformers.map((athlete: any, idx: number) => (
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
                      <span className={`font-bold ${activeTab === 'putra' ? 'text-cyan-400' : 'text-purple-400'}`}>{athlete.overallRating}</span>
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
                {topAttendees.map((athlete: any, idx: number) => (
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
                      {athlete.attendances.filter((a:any) => a.isPresent).length} / {athlete.totalDaysRecorded} Hari
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
              <Trophy className="w-5 h-5 text-amber-500" /> 
              {activeTab === 'putra' ? 'Kings of the Weight Class' : 'Queens of the Weight Class'}
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
                {topPerWeightClass.map((athlete: any) => (
                  <tr key={athlete.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className={`py-3 px-5 font-bold ${activeTab === 'putra' ? 'text-cyan-400' : 'text-purple-400'}`}>{athlete.weightClass}</td>
                    <td className="py-3 px-5 font-bold text-slate-200">{athlete.name}</td>
                    <td className="py-3 px-5 text-center text-slate-400">{athlete.classGroup}</td>
                    <td className="py-3 px-5 text-center">
                      <span className="font-bold text-amber-400">{athlete.overallRating}</span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Link href={`/athletes/${athlete.id}`} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 bg-cyan-500/10 rounded-lg transition-colors">
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
