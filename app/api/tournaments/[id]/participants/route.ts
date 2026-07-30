import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { athleteIds } = await req.json()
    
    if (!Array.isArray(athleteIds)) {
      return new NextResponse("athleteIds must be an array", { status: 400 })
    }

    // Wrap the sync in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete participants that are not in the new list
      await tx.tournamentParticipant.deleteMany({
        where: {
          tournamentId: params.id,
          athleteId: {
            notIn: athleteIds
          }
        }
      })

      // 2. Add new participants (upsert to avoid unique constraint errors)
      for (const athleteId of athleteIds) {
        // Upsert creates if it doesn't exist, updates if it does
        await tx.tournamentParticipant.upsert({
          where: {
            tournamentId_athleteId: {
              tournamentId: params.id,
              athleteId: athleteId
            }
          },
          update: {},
          create: {
            tournamentId: params.id,
            athleteId: athleteId
          }
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PARTICIPANTS_SYNC]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
