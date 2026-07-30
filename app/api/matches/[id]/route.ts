import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

    const match = await prisma.match.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error("[MATCH_DELETE]", error)
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
    const { opponentName, round, result, score, notes, date } = body

    const match = await prisma.match.update({
      where: {
        id: params.id
      },
      data: {
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
    console.error("[MATCH_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
