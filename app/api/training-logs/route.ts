import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }})
    if (!user || !user.athleteId) {
       return NextResponse.json({ message: "Anda bukan atlet terdaftar" }, { status: 403 })
    }

    const body = await req.json()
    const { date, bpm, runningPace, impactForce, restHours } = body

    const log = await prisma.physicalMetric.create({
      data: {
        athleteId: user.athleteId,
        date,
        bpm: parseInt(bpm),
        runningPace: parseFloat(runningPace),
        impactForce: parseFloat(impactForce),
        restHours: parseFloat(restHours)
      }
    })

    return NextResponse.json({ message: "Log berhasil ditambahkan", log }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
