import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: { id: string; participantId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { medal } = await req.json()

    const participant = await prisma.tournamentParticipant.update({
      where: {
        id: params.participantId,
        tournamentId: params.id,
      },
      data: {
        medal
      }
    })

    return NextResponse.json(participant)
  } catch (error) {
    console.error("[PARTICIPANT_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
