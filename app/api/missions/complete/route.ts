import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ATHLETE") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } })
    if (!user || !user.athleteId) {
      return NextResponse.json({ message: "Profil atlet tidak ditemukan" }, { status: 404 })
    }

    const { missionId, resultNote } = await req.json()

    if (!resultNote || resultNote.trim() === "") {
      return NextResponse.json({ message: "Catatan bukti/hasil latihan wajib diisi!" }, { status: 400 })
    }

    await prisma.missionProgress.update({
      where: {
        missionId_athleteId: {
          missionId: missionId,
          athleteId: user.athleteId
        }
      },
      data: {
        isDone: true,
        resultNote: resultNote,
        completedAt: new Date()
      }
    })

    return NextResponse.json({ message: "Misi berhasil diselesaikan!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal menyelesaikan misi" }, { status: 500 })
  }
}
