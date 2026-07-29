import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AttendanceClient from "./AttendanceClient"

export default async function AttendancePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Attendance Tracking</h1>
        <p className="text-slate-400 mt-2">Manage daily athlete presence for all classes.</p>
      </div>

      <AttendanceClient />
    </div>
  )
}
