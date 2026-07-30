"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

type Athlete = {
  id: string
  name: string
}

export default function AddMatchModal({ 
  tournamentId, 
  athletes 
}: { 
  tournamentId: string, 
  athletes: Athlete[] 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [athleteId, setAthleteId] = useState('')
  const [opponentName, setOpponentName] = useState('')
  const [round, setRound] = useState('')
  const [result, setResult] = useState('Win')
  const [score, setScore] = useState('')
  const [notes, setNotes] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tournamentId, 
          athleteId, 
          opponentName, 
          round, 
          result, 
          score, 
          notes 
        })
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
        // Reset form
        setAthleteId('')
        setOpponentName('')
        setRound('')
        setResult('Win')
        setScore('')
        setNotes('')
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
        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Match
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Record Match Result</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Athlete *</label>
                <select
                  required
                  value={athleteId}
                  onChange={(e) => setAthleteId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="" disabled>Select Athlete</option>
                  {athletes.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Opponent Name *</label>
                <input 
                  type="text" 
                  required
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g. Budi (Klub Macan)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Round/Babak</label>
                  <input 
                    type="text" 
                    value={round}
                    onChange={(e) => setRound(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. Penyisihan, Semi Final"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Result *</label>
                  <select
                    required
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Win">Win</option>
                    <option value="Loss">Loss</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Score</label>
                <input 
                  type="text" 
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g. 12-8 or R1: 5-2, R2: 7-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Coach Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
                  placeholder="Evaluation notes, mistakes to fix, good techniques used..."
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
                  {loading ? 'Saving...' : 'Save Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
