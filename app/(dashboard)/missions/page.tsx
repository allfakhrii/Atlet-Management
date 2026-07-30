import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import MissionsClient from "./MissionsClient"

export default async function MissionsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }})
  const role = user?.role || "ATHLETE"
  
  let missionsData: any = []

  let tournaments: any[] = []

  if (role === "ADMIN") {
    // Admin melihat semua misi dan progres setiap atlet
    missionsData = await prisma.mission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        progress: {
          include: { athlete: true }
        }
      }
    })
    
    tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true }
    })
  } else {
    // Atlet hanya melihat misi yang ditugaskan kepada mereka
    if (user?.athleteId) {
      missionsData = await prisma.missionProgress.findMany({
        where: { athleteId: user.athleteId },
        include: { mission: true },
        orderBy: { mission: { targetDate: "asc" } }
      })
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Target & Missions</h1>
        <p className="text-slate-400 mt-1">
          {role === "ADMIN" 
            ? "Tugaskan misi harian/mingguan ke semua atlet Anda secara serentak." 
            : "Selesaikan misi dari pelatih dan laporkan hasil latihanmu."}
        </p>
      </div>

      <MissionsClient role={role} initialData={missionsData} tournaments={tournaments} />
    </div>
  )
}
