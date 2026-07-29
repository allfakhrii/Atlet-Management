"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit2, X } from "lucide-react"

export default function EditAthleteButton({ 
  athlete 
}: { 
  athlete: {
    id: string;
    name: string;
    classGroup: string;
    weightClass: string;
    age: number;
    belt?: string;
    dateOfBirth: Date | string | null;
  } 
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const initialDate = athlete.dateOfBirth ? new Date(athlete.dateOfBirth) : null;
  const [dobDay, setDobDay] = useState(initialDate ? initialDate.getDate().toString() : "")
  const [dobMonth, setDobMonth] = useState(initialDate ? (initialDate.getMonth() + 1).toString() : "")
  const [dobYear, setDobYear] = useState(initialDate ? initialDate.getFullYear().toString() : "")

  const [formData, setFormData] = useState({
    classGroup: athlete.classGroup || "Reguler",
    weightClass: athlete.weightClass || "",
    belt: athlete.belt || "Putih",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dateOfBirth = (dobYear && dobMonth && dobDay) 
        ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}` 
        : "";

      const res = await fetch(`/api/athletes/${athlete.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, dateOfBirth })
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
      } else {
        alert("Gagal menyimpan data")
      }
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-2.5 rounded-xl transition-colors border border-amber-500/20 flex items-center justify-center"
        title="Edit Data Atlet"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Edit Data Atlet</h2>
            
            <div className="mb-4">
              <p className="text-sm text-slate-400">Nama Atlet</p>
              <p className="font-bold text-white">{athlete.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Grup Kelas</label>
                <select 
                  value={formData.classGroup}
                  onChange={(e) => setFormData({...formData, classGroup: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Reguler">Kelas Reguler</option>
                  <option value="Prestasi">Kelas Prestasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Kelas Berat (Weight Class)</label>
                <input 
                  type="text" 
                  value={formData.weightClass}
                  onChange={(e) => setFormData({...formData, weightClass: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Misal: Bantam (-63kg)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Lahir</label>
                <div className="flex gap-2">
                  <select
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    className="w-1/3 bg-slate-800 border border-slate-700 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="">Tgl</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                      <option key={d} value={d.toString()}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    className="w-1/3 bg-slate-800 border border-slate-700 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="">Bulan</option>
                    {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                      <option key={m} value={(i + 1).toString()}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    className="w-1/3 bg-slate-800 border border-slate-700 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="">Tahun</option>
                    {Array.from({length: 50}, (_, i) => new Date().getFullYear() - 5 - i).map(y => (
                      <option key={y} value={y.toString()}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Sabuk Taekwondo</label>
                <select 
                  value={formData.belt}
                  onChange={(e) => setFormData({...formData, belt: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Putih">Putih (Geup 10)</option>
                  <option value="Kuning">Kuning (Geup 9)</option>
                  <option value="Kuning Strip">Kuning Strip Hijau (Geup 8)</option>
                  <option value="Hijau">Hijau (Geup 7)</option>
                  <option value="Hijau Strip">Hijau Strip Biru (Geup 6)</option>
                  <option value="Biru">Biru (Geup 5)</option>
                  <option value="Biru Strip">Biru Strip Merah (Geup 4)</option>
                  <option value="Merah">Merah (Geup 3)</option>
                  <option value="Merah Strip">Merah Strip Hitam (Geup 2 / Geup 1)</option>
                  <option value="Hitam">Hitam (DAN)</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
