import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tournaments = await prisma.tournament.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        matches: true
      }
    })

    return NextResponse.json(tournaments)
  } catch (error) {
    console.error("[TOURNAMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, date, location, description } = body

    if (!name || !date) {
      return new NextResponse("Name and date are required", { status: 400 })
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        date: new Date(date),
        location,
        description,
      }
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error("[TOURNAMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
