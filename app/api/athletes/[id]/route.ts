import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const athleteId = params.id
    
    // Hapus User yang terikat (jika ada)
    await prisma.user.deleteMany({
      where: { athleteId }
    })

    // Hapus Athlete
    await prisma.athlete.delete({
      where: { id: athleteId }
    })

    return NextResponse.json({ message: "Atlet berhasil dihapus" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal menghapus atlet" }, { status: 500 })
  }
}
