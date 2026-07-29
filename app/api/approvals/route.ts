import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"


export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  const pendingUsers = await prisma.user.findMany({
    where: { role: "ATHLETE", isApproved: false },
    include: { athlete: true }
  })

  return NextResponse.json(pendingUsers)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const { userId } = await req.json()

    // Approve user dan ubah status athlete jadi Active
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
      include: { athlete: true }
    })

    if (user.athleteId) {
       await prisma.athlete.update({
         where: { id: user.athleteId },
         data: { status: "Active" }
       })
    }

    return NextResponse.json({ message: "Berhasil menyetujui atlet" })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const { userId } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Hapus akun user
    await prisma.user.delete({
      where: { id: userId }
    })

    // Hapus profil atlet yang nganggur
    if (user.athleteId) {
      await prisma.athlete.delete({
        where: { id: user.athleteId }
      })
    }

    return NextResponse.json({ message: "Pendaftaran berhasil ditolak dan dihapus" })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
