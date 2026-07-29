"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

export default function ApprovalList({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (userId: string) => {
    setLoading(userId)
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (userId: string) => {
    if (!confirm("Yakin ingin menolak pendaftaran ini? Data atlet akan dihapus permanen.")) return;
    
    setLoading(userId)
    try {
      const res = await fetch("/api/approvals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700/60 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Semua Sudah Beres!</h3>
        <p className="text-slate-400">Tidak ada pendaftaran atlet baru yang menunggu persetujuan.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 text-sm">
            <tr>
              <th className="py-4 px-6 font-medium">Nama Atlet</th>
              <th className="py-4 px-6 font-medium">Email</th>
              <th className="py-4 px-6 font-medium">Umur</th>
              <th className="py-4 px-6 font-medium">Kelas Berat</th>
              <th className="py-4 px-6 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-200">{user.name}</td>
                <td className="py-4 px-6 text-slate-400">{user.email}</td>
                <td className="py-4 px-6 text-slate-400">{user.athlete?.age || "-"}</td>
                <td className="py-4 px-6 text-slate-400">{user.athlete?.weightClass || "-"}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleReject(user.id)}
                      disabled={loading === user.id}
                      className="text-sm font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-4 py-2 rounded-lg transition-colors border border-rose-500/20 disabled:opacity-50"
                    >
                      {loading === user.id ? "Memproses..." : "Tolak"}
                    </button>
                    <button 
                      onClick={() => handleApprove(user.id)}
                      disabled={loading === user.id}
                      className="text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                    >
                      {loading === user.id ? "Memproses..." : "Terima (ACC)"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
