import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const { 
      power, speed, stamina, agility, technique, defense,
      headshotAcc, bodyKickAcc, blockPercentage, fouls 
    } = await req.json()

    const athleteId = params.id

    // Update or Create RadarAttributes
    await prisma.radarAttribute.upsert({
      where: { athleteId },
      update: { power, speed, stamina, agility, technique, defense },
      create: { athleteId, power, speed, stamina, agility, technique, defense }
    })

    // Update or Create CombatStats
    await prisma.combatStat.upsert({
      where: { athleteId },
      update: { headshotAcc, bodyKickAcc, blockPercentage, fouls },
      create: { athleteId, headshotAcc, bodyKickAcc, blockPercentage, fouls }
    })

    // Also update Overall Rating dynamically based on Radar Attributes average
    const overallRating = Math.round((power + speed + stamina + agility + technique + defense) / 6)
    
    await prisma.athlete.update({
      where: { id: athleteId },
      data: { overallRating }
    })

    return NextResponse.json({ message: "Stats updated successfully!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal memperbarui stats" }, { status: 500 })
  }
}
