import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { tournamentId, athleteId, opponentName, round, result, score, notes, date } = body

    if (!tournamentId || !athleteId || !opponentName || !result) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const match = await prisma.match.create({
      data: {
        tournamentId,
        athleteId,
        opponentName,
        round,
        result,
        score,
        notes,
        date: date ? new Date(date) : undefined
      }
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error("[MATCHES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
