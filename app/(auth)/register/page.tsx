"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("ATHLETE")
  const [secretCode, setSecretCode] = useState("")
  
  // Date of Birth fields
  const [dobDay, setDobDay] = useState("")
  const [dobMonth, setDobMonth] = useState("")
  const [dobYear, setDobYear] = useState("")
  
  const [weightClass, setWeightClass] = useState("")
  const [classGroup, setClassGroup] = useState("Reguler")
  const [gender, setGender] = useState("Laki-laki")
  const [belt, setBelt] = useState("Putih")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const dateOfBirth = role === "ATHLETE" ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}` : undefined;

      const payload = {
        name,
        email,
        password,
        role,
        ...(role === "ADMIN" && { secretCode }),
        ...(role === "ATHLETE" && { dateOfBirth, weightClass, classGroup, gender, belt })
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendaftar")
      }

      setSuccess("Registrasi berhasil! Mengalihkan ke halaman Login...")
      
      // Delay redirect selama 2.5 detik agar user bisa membaca pesan sukses
      setTimeout(() => {
        router.push("/login")
      }, 2500)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-4 border border-emerald-500/20">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Join the Taekwondo Analytics Hub</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Daftar Sebagai</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="ATHLETE">Atlet Taekwondo</option>
                <option value="ADMIN">Pelatih (Admin)</option>
              </select>
            </div>

            {role === "ADMIN" && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Kode Rahasia Pelatih</label>
                <input
                  type="password"
                  required
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="w-full bg-slate-950 border border-rose-900/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-rose-500 transition-colors"
                  placeholder="Masukkan kode rahasia"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            
            {role === "ATHLETE" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tgl. Lahir</label>
                  <div className="flex gap-2">
                    <select
                      required
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                      className="w-1/3 bg-slate-950 border border-slate-800 text-white px-3 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Tgl</option>
                      {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                        <option key={d} value={d.toString()}>{d}</option>
                      ))}
                    </select>
                    <select
                      required
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                      className="w-1/3 bg-slate-950 border border-slate-800 text-white px-3 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Bulan</option>
                      {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                        <option key={m} value={(i + 1).toString()}>{m}</option>
                      ))}
                    </select>
                    <select
                      required
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      className="w-1/3 bg-slate-950 border border-slate-800 text-white px-3 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Tahun</option>
                      {Array.from({length: 50}, (_, i) => new Date().getFullYear() - 5 - i).map(y => (
                        <option key={y} value={y.toString()}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Kelas Berat</label>
                  <select
                    required
                    value={weightClass}
                    onChange={(e) => setWeightClass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Pilih</option>
                    <option value="Fin (-54kg)">Fin (-54kg)</option>
                    <option value="Fly (-58kg)">Fly (-58kg)</option>
                    <option value="Bantam (-63kg)">Bantam (-63kg)</option>
                    <option value="Feather (-68kg)">Feather (-68kg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Jenis Kelamin</label>
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Grup</label>
                  <select
                    required
                    value={classGroup}
                    onChange={(e) => setClassGroup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Prestasi">Prestasi</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Sabuk Taekwondo</label>
                  <select
                    required
                    value={belt}
                    onChange={(e) => setBelt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
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
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 mt-6"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-slate-500 text-center mt-6 text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
