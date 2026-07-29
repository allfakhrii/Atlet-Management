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
    const { title, description, targetDate } = await req.json()

    // 1. Buat misi baru
    const newMission = await prisma.mission.create({
      data: {
        title,
        description,
        targetDate: new Date(targetDate)
      }
    })

    // 2. Ambil semua atlet aktif
    const activeAthletes = await prisma.athlete.findMany({
      where: { status: "Active" }
    })

    // 3. Tugaskan misi ini ke semua atlet (Broadcast)
    if (activeAthletes.length > 0) {
      const progressData = activeAthletes.map(athlete => ({
        missionId: newMission.id,
        athleteId: athlete.id
      }))

      await prisma.missionProgress.createMany({
        data: progressData
      })
    }

    return NextResponse.json({ message: "Misi berhasil di-broadcast ke semua atlet!" }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal membuat misi" }, { status: 500 })
  }
}
