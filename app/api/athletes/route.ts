import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const searchParams = req.nextUrl.searchParams
    const excludeId = searchParams.get('excludeId')

    const athletes = await prisma.athlete.findMany({
      where: {
        ...(excludeId ? { id: { not: excludeId } } : {})
      },
      include: {
        radarAttributes: true,
        combatStats: true,
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(athletes)
  } catch (error) {
    console.error("Error fetching athletes:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
