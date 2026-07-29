"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckCircle2, XCircle } from "lucide-react"

export default function AttendanceClient() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [athletes, setAthletes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("Reguler")

  useEffect(() => {
    fetchAttendance()
  }, [date])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/attendance?date=${date}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setAthletes(data)
      } else {
        console.error("Failed to load athletes array:", data)
        setAthletes([])
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setAthletes([])
    } finally {
      setLoading(false)
    }
  }

  const toggleAttendance = async (athleteId: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setAthletes(prev => prev.map(a => 
        a.id === athleteId 
          ? { ...a, attendances: [{ isPresent: !currentStatus }] }
          : a
      ))

      await fetch(`/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId,
          date,
          isPresent: !currentStatus
        })
      })
    } catch (err) {
      console.error("Failed to update attendance", err)
      // Revert on failure (simple reload for now)
      fetchAttendance()
    }
  }

  const filteredAthletes = athletes.filter(a => a.classGroup === activeTab)
  
  // Calculate stats for current tab
  const totalInTab = filteredAthletes.length
  const presentInTab = filteredAthletes.filter(a => a.attendances?.[0]?.isPresent).length

  return (
    <div className="space-y-6">
      {/* Date Picker & Stats Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Select Date</p>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none text-white text-lg font-bold focus:outline-none focus:ring-0 p-0"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-sm text-slate-400">Total Athletes</p>
            <p className="text-2xl font-black text-white">{totalInTab}</p>
          </div>
          <div className="w-px h-10 bg-slate-800"></div>
          <div className="text-center">
            <p className="text-sm text-slate-400">Present</p>
            <p className="text-2xl font-black text-emerald-400">{presentInTab}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-slate-800">
        {["Reguler", "Prestasi"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab 
                ? "bg-slate-800 text-white shadow-sm border border-slate-700" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            Kelas {tab}
          </button>
        ))}
      </div>

      {/* Athletes List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
            Loading athletes...
          </div>
        ) : filteredAthletes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Tidak ada atlet aktif di Kelas {activeTab}.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {filteredAthletes.map(athlete => {
              const isPresent = athlete.attendances?.[0]?.isPresent || false;
              
              return (
                <div key={athlete.id} className="flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700">
                      {athlete.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{athlete.name}</h3>
                      <p className="text-xs text-slate-500">ID: {athlete.id.split('-')[0]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleAttendance(athlete.id, isPresent)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        isPresent 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" 
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {isPresent ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isPresent ? "Hadir" : "Tidak Hadir"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
