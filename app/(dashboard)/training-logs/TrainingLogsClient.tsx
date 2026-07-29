"use client"

import { useState } from "react"
import { Trash2, Plus, Activity } from "lucide-react"

export default function TrainingLogsClient({ initialLogs, role }: { initialLogs: any[], role: string }) {
  const [logs, setLogs] = useState(initialLogs)
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [date, setDate] = useState("")
  const [bpm, setBpm] = useState("")
  const [runningPace, setRunningPace] = useState("")
  const [impactForce, setImpactForce] = useState("")
  const [restHours, setRestHours] = useState("")
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/training-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, bpm, runningPace, impactForce, restHours }),
      })
      
      const data = await res.json()
      if (res.ok) {
        setLogs([data.log, ...logs])
        setShowForm(false)
        setDate(""); setBpm(""); setRunningPace(""); setImpactForce(""); setRestHours("");
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Yakin hapus log latihan ini?")) return;
    
    try {
      const res = await fetch(`/api/training-logs/${id}`, { method: "DELETE" })
      if (res.ok) {
        setLogs(logs.filter(l => l.id !== id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      {role === "ATHLETE" && (
        <div className="flex justify-end">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Input Hasil Latihan
          </button>
        </div>
      )}

      {showForm && role === "ATHLETE" && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Input Log Latihan Fisik</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Tanggal (YYYY-MM-DD)</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Detak Jantung Istirahat (BPM)</label>
              <input type="number" required value={bpm} onChange={(e) => setBpm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500" placeholder="Cth: 55" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Kecepatan Jogging (min/km)</label>
              <input type="number" step="0.1" required value={runningPace} onChange={(e) => setRunningPace(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500" placeholder="Cth: 5.2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Kekuatan Tendangan Rata-rata (kg)</label>
              <input type="number" step="0.1" required value={impactForce} onChange={(e) => setImpactForce(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500" placeholder="Cth: 200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Jam Tidur / Istirahat</label>
              <input type="number" step="0.1" required value={restHours} onChange={(e) => setRestHours(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500" placeholder="Cth: 7.5" />
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-colors">
                {loading ? "Menyimpan..." : "Simpan Log"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-sm">
              <tr>
                <th className="py-4 px-6 font-medium">Tanggal</th>
                {role === "ADMIN" && <th className="py-4 px-6 font-medium">Atlet</th>}
                <th className="py-4 px-6 font-medium">BPM</th>
                <th className="py-4 px-6 font-medium">Pace Lari</th>
                <th className="py-4 px-6 font-medium">Impact Force</th>
                <th className="py-4 px-6 font-medium">Tidur</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">Belum ada data log latihan.</td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-200">{log.date}</td>
                  {role === "ADMIN" && <td className="py-4 px-6 text-slate-300">{log.athlete?.name || "Unknown"}</td>}
                  <td className="py-4 px-6 text-slate-400">{log.bpm} bpm</td>
                  <td className="py-4 px-6 text-slate-400">{log.runningPace} min/km</td>
                  <td className="py-4 px-6 text-slate-400">{log.impactForce} kg</td>
                  <td className="py-4 px-6 text-slate-400">{log.restHours} jam</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(log.id)}
                      className="text-rose-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
