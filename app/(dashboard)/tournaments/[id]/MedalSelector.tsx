"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function MedalSelector({
  tournamentId,
  participantId,
  initialMedal
}: {
  tournamentId: string
  participantId: string
  initialMedal: string | null
}) {
  const [medal, setMedal] = useState(initialMedal || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async (newMedal: string) => {
    setMedal(newMedal)
    setLoading(true)
    try {
      await fetch(`/api/tournaments/${tournamentId}/participants/${participantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medal: newMedal || null })
      })
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={medal}
      onChange={(e) => handleUpdate(e.target.value)}
      disabled={loading}
      className={`text-xs font-bold rounded-lg px-2 py-1 border transition-colors focus:outline-none appearance-none cursor-pointer ${
        medal === "Emas" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/50" :
        medal === "Perak" ? "bg-slate-300/10 text-slate-300 border-slate-300/50" :
        medal === "Perunggu" ? "bg-amber-700/10 text-amber-600 border-amber-700/50" :
        "bg-slate-800 text-slate-400 border-slate-700"
      }`}
    >
      <option value="">-- No Medal --</option>
      <option value="Emas">🥇 Emas</option>
      <option value="Perak">🥈 Perak</option>
      <option value="Perunggu">🥉 Perunggu</option>
    </select>
  )
}
