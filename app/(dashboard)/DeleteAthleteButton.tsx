"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteAthleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus atlet ini? Seluruh data pelatihannya akan hilang permanen!")) return;

    setLoading(true)
    try {
      const res = await fetch(`/api/athletes/${id}`, {
        method: "DELETE",
      })
      
      if (res.ok) {
        router.refresh()
      } else {
        alert("Gagal menghapus atlet")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-3 py-2 rounded-lg transition-colors ml-2 disabled:opacity-50"
      title="Hapus Atlet"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
