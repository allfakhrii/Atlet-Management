"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

export default function AddTournamentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [tDay, setTDay] = useState('')
  const [tMonth, setTMonth] = useState('')
  const [tYear, setTYear] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const date = `${tYear}-${tMonth.padStart(2, '0')}-${tDay.padStart(2, '0')}`
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, location, description })
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
        // Reset form
        setName('')
        setTDay('')
        setTMonth('')
        setTYear('')
        setLocation('')
        setDescription('')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-colors"
      >
        <Plus className="w-5 h-5" />
        New Tournament
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Tournament</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tournament Name *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g. Kejurda Jabar 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date *</label>
                <div className="flex gap-2">
                  <select
                    required
                    value={tDay}
                    onChange={(e) => setTDay(e.target.value)}
                    className="w-1/3 bg-slate-800 border border-slate-700 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Tgl</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                      <option key={d} value={d.toString()}>{d}</option>
                    ))}
                  </select>
                  <select
                    required
                    value={tMonth}
                    onChange={(e) => setTMonth(e.target.value)}
                    className="w-1/3 bg-slate-800 border border-slate-700 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Bulan</option>
                    {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                      <option key={m} value={(i + 1).toString()}>{m}</option>
                    ))}
                  </select>
                  <select
                    required
                    value={tYear}
                    onChange={(e) => setTYear(e.target.value)}
                    className="w-1/3 bg-slate-800 border border-slate-700 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Tahun</option>
                    {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 1 + i).map(y => (
                      <option key={y} value={y.toString()}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g. GOR Saparua, Bandung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description / Notes</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
                  placeholder="Optional details about this tournament..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold px-6 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Tournament'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
