"use client"

import { useState } from "react"
import { Target, CheckCircle2, Circle, Clock, Plus, PenSquare } from "lucide-react"

export default function MissionsClient({ role, initialData, tournaments = [] }: { role: string, initialData: any[], tournaments?: any[] }) {
  const [data, setData] = useState(initialData)
  
  // Admin Form State
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [targetAudience, setTargetAudience] = useState("ALL")
  const [creating, setCreating] = useState(false)

  // Athlete Proof Modal State
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [resultNote, setResultNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, targetDate, targetAudience })
      })
      if (res.ok) {
        const data = await res.json()
        alert(data.message)
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.message || "Gagal membuat misi.")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleCompleteMission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMissionId) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/missions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: selectedMissionId, resultNote })
      })
      if (res.ok) {
        // Update local state to show as done
        setData(data.map((item: any) => {
          if (item.missionId === selectedMissionId) {
            return { ...item, isDone: true, resultNote }
          }
          return item
        }))
        setSelectedMissionId(null)
        setResultNote("")
      } else {
        const errorData = await res.json()
        alert(errorData.message)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (role === "ADMIN") {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button 
            onClick={() => setShowAdminForm(!showAdminForm)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <Plus className="w-5 h-5" /> Buat Misi Baru
          </button>
        </div>

        {showAdminForm && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Tugaskan Misi Baru ke Semua Atlet</h2>
            <form onSubmit={handleCreateMission} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Judul Misi</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Contoh: Lari Pagi 5KM" className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Deskripsi Lengkap & Target</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Contoh: Lari 5KM, laporkan waktu tempuh dan rata-rata detak jantung." className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500 min-h-[100px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Batas Waktu (Target Date)</label>
                <input required value={targetDate} onChange={e => setTargetDate(e.target.value)} type="date" className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Target Atlet</label>
                <select value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-cyan-500 appearance-none">
                  <option value="ALL">Semua Atlet Aktif</option>
                  <option value="CLASS_REGULER">Kelas Reguler</option>
                  <option value="CLASS_PRESTASI">Kelas Prestasi</option>
                  {tournaments.map(t => (
                    <option key={t.id} value={`TOURNAMENT_${t.id}`}>Turnamen: {t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={creating} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {creating ? "Memproses..." : "Tugaskan ke Semua Atlet"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {data.length === 0 ? (
             <div className="text-center text-slate-500 py-12 bg-slate-800/50 rounded-2xl border border-slate-700/50">Belum ada misi yang dibuat.</div>
          ) : (
            data.map((mission: any) => (
              <div key={mission.id} className="bg-slate-800 rounded-2xl border border-slate-700/60 overflow-hidden shadow-lg">
                <div className="p-6 border-b border-slate-700/60 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                    </div>
                    <p className="text-slate-400">{mission.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 mb-1">Batas Waktu</p>
                    <p className="text-white font-semibold flex items-center gap-2 justify-end">
                      <Clock className="w-4 h-4 text-emerald-400" /> 
                      {new Date(mission.targetDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                
                {/* Laporan Atlet */}
                <div className="bg-slate-900/50 p-6">
                  <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Laporan Atlet ({mission.progress.filter((p:any) => p.isDone).length}/{mission.progress.length} Selesai)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mission.progress.map((prog: any) => (
                      <div key={prog.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-slate-200">{prog.athlete.name}</span>
                          {prog.isDone ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Selesai</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-700 px-2 py-1 rounded-full"><Circle className="w-3 h-3" /> Tertunda</span>
                          )}
                        </div>
                        {prog.isDone ? (
                          <div className="bg-slate-900 p-3 rounded-lg text-sm text-slate-300 italic border border-slate-700/50">
                            "{prog.resultNote}"
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500 italic">Belum mengumpulkan laporan.</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // --- ATHLETE VIEW ---
  return (
    <div className="space-y-6">
      {/* Modal / Form untuk laporan */}
      {selectedMissionId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-white mb-2">Laporkan Hasil Misi</h2>
            <p className="text-slate-400 text-sm mb-6">Tuliskan hasil latihan Anda secara detail (misal: waktu tempuh, detak jantung, dll) sebagai bukti kepada pelatih.</p>
            
            <form onSubmit={handleCompleteMission} className="space-y-4">
              <textarea 
                required 
                value={resultNote} 
                onChange={e => setResultNote(e.target.value)} 
                placeholder="Contoh: Alhamdulillah selesai Coach! Jarak 5KM ditempuh dalam 32 menit. BPM rata-rata 145." 
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-4 rounded-xl focus:border-cyan-500 min-h-[150px]" 
              />
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setSelectedMissionId(null)} className="px-4 py-2 font-medium text-slate-400 hover:text-white transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {submitting ? "Mengirim..." : "Kirim Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center text-slate-500 py-12 bg-slate-800/50 rounded-2xl border border-slate-700/50">Belum ada misi dari pelatih. Santai dulu!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((prog: any) => {
            const mission = prog.mission
            return (
              <div key={prog.id} className={`p-6 rounded-2xl border shadow-lg relative overflow-hidden ${prog.isDone ? 'bg-slate-800/50 border-emerald-500/20' : 'bg-slate-800 border-slate-700/60'}`}>
                {prog.isDone && <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4"></div>}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Target className={`w-8 h-8 ${prog.isDone ? 'text-emerald-400' : 'text-cyan-400'}`} />
                    <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                  </div>
                  {prog.isDone && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                </div>
                
                <p className="text-slate-400 mb-6">{mission.description}</p>
                
                <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-4">
                  <div className="text-sm">
                    <span className="block text-slate-500 font-medium">Batas Waktu</span>
                    <span className="text-slate-300 font-semibold">{new Date(mission.targetDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  
                  {!prog.isDone ? (
                    <button 
                      onClick={() => setSelectedMissionId(mission.id)}
                      className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      <PenSquare className="w-4 h-4" /> Lapor Selesai
                    </button>
                  ) : (
                    <div className="text-right text-sm">
                      <span className="block text-emerald-400 font-bold mb-1">Berhasil Diselesaikan</span>
                    </div>
                  )}
                </div>
                
                {prog.isDone && prog.resultNote && (
                  <div className="mt-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <span className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Laporan Anda:</span>
                    <p className="text-sm text-slate-300 italic">"{prog.resultNote}"</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
