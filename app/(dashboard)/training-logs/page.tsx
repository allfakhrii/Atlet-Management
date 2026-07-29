import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import TrainingLogsClient from "./TrainingLogsClient"

export default async function TrainingLogsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }})
  let logs: any[] = []
  let athleteId: string | null = null

  if (user?.role === "ATHLETE") {
    if (!user.athleteId) {
      return <div className="text-white p-8">Profil belum siap.</div>
    }
    athleteId = user.athleteId
    logs = await prisma.physicalMetric.findMany({
      where: { athleteId: user.athleteId },
      orderBy: { date: "desc" }
    })
  } else if (user?.role === "ADMIN") {
     // Admin melihat log terbaru semua atlet
     logs = await prisma.physicalMetric.findMany({
       orderBy: { date: "desc" },
       include: { athlete: true },
       take: 50
     })
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Training Logs</h1>
        <p className="text-slate-400 mt-1">
          {user?.role === "ADMIN" ? "Pantau semua hasil latihan harian atlet Anda." : "Input hasil jogging dan latihan fisik Anda di sini."}
        </p>
      </div>

      <TrainingLogsClient 
        initialLogs={logs} 
        role={user?.role || "ATHLETE"} 
      />
    </div>
  )
}
