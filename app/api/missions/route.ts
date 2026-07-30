import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const { title, description, targetDate, targetAudience } = await req.json()

    // 1. Ambil target atlet sesuai audience
    let activeAthletes = []
    
    if (targetAudience === "ALL") {
      activeAthletes = await prisma.athlete.findMany({
        where: { status: "Active" }
      })
    } else if (targetAudience === "CLASS_REGULER") {
      activeAthletes = await prisma.athlete.findMany({
        where: { status: "Active", classGroup: "Reguler" }
      })
    } else if (targetAudience === "CLASS_PRESTASI") {
      activeAthletes = await prisma.athlete.findMany({
        where: { status: "Active", classGroup: "Prestasi" }
      })
    } else if (targetAudience?.startsWith("TOURNAMENT_")) {
      const tournamentId = targetAudience.replace("TOURNAMENT_", "")
      const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
        include: { athlete: true }
      })
      activeAthletes = participants
        .map(p => p.athlete)
        .filter(a => a.status === "Active")
    }

    if (activeAthletes.length === 0) {
      return NextResponse.json({ message: "Tidak ada atlet aktif yang memenuhi kriteria target." }, { status: 400 })
    }

    // 2. Buat misi baru
    const newMission = await prisma.mission.create({
      data: {
        title,
        description,
        targetDate: new Date(targetDate)
      }
    })

    // 3. Tugaskan misi ini ke atlet terpilih
    const progressData = activeAthletes.map(athlete => ({
      missionId: newMission.id,
      athleteId: athlete.id
    }))

    await prisma.missionProgress.createMany({
      data: progressData
    })

    return NextResponse.json({ message: `Misi berhasil ditugaskan ke ${activeAthletes.length} atlet!` }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal membuat misi" }, { status: 500 })
  }
}
