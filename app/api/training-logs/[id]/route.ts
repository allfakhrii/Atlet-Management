import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const logId = params.id
    
    // Verifikasi bahwa log ini milik atlet yang bersangkutan atau admin
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }})
    const log = await prisma.physicalMetric.findUnique({ where: { id: logId } })

    if (!log) {
       return NextResponse.json({ message: "Log tidak ditemukan" }, { status: 404 })
    }

    if (user?.role !== "ADMIN" && user?.athleteId !== log.athleteId) {
       return NextResponse.json({ message: "Anda tidak berhak menghapus data ini" }, { status: 403 })
    }

    await prisma.physicalMetric.delete({
      where: { id: logId }
    })

    return NextResponse.json({ message: "Log berhasil dihapus" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal menghapus log" }, { status: 500 })
  }
}
