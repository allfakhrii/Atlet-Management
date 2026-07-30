import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tournament = await prisma.tournament.findUnique({
      where: {
        id: params.id
      },
      include: {
        matches: {
          include: {
            athlete: true
          }
        }
      }
    })

    if (!tournament) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(tournament)
  } catch (error) {
    console.error("[TOURNAMENT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tournament = await prisma.tournament.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error("[TOURNAMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, date, location, description } = body

    const tournament = await prisma.tournament.update({
      where: {
        id: params.id
      },
      data: {
        name,
        date: date ? new Date(date) : undefined,
        location,
        description,
      }
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error("[TOURNAMENT_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
