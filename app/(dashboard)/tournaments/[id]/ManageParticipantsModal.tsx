"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, X } from 'lucide-react'

type Athlete = {
  id: string
  name: string
  weightClass: string
}

export default function ManageParticipantsModal({ 
  tournamentId, 
  allAthletes,
  initialSelectedIds
}: { 
  tournamentId: string, 
  allAthletes: Athlete[],
  initialSelectedIds: string[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Use a Set for easier toggling
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds))
  const router = useRouter()

  const handleToggle = (athleteId: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(athleteId)) {
      newSet.delete(athleteId)
    } else {
      newSet.add(athleteId)
    }
    setSelectedIds(newSet)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          athleteIds: Array.from(selectedIds)
        })
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
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
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 font-bold px-4 py-2.5 rounded-xl transition-all text-sm"
      >
        <Users className="w-4 h-4" />
        Manage Participants
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-xl font-bold text-white">Manage Participants</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-4 shrink-0">
              Pilih atlet yang akan didaftarkan atau diberangkatkan ke turnamen ini.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
              <div className="overflow-y-auto pr-2 space-y-2 pb-4 mb-4 flex-1">
                {allAthletes.map(athlete => {
                  const isSelected = selectedIds.has(athlete.id)
                  return (
                    <div 
                      key={athlete.id}
                      onClick={() => handleToggle(athlete.id)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/50' 
                          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className={`font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                          {athlete.name}
                        </div>
                        <div className="text-xs text-slate-500">{athlete.weightClass}</div>
                      </div>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-slate-900 border-slate-600'
                      }`}>
                        {isSelected && <svg className="w-3.5 h-3.5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
                <div className="text-sm text-slate-400 font-medium">
                  {selectedIds.size} athletes selected
                </div>
                <div className="flex gap-3">
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
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
