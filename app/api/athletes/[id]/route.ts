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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const athleteId = params.id
    const body = await req.json()

    // Ambil data yang mau diupdate
    const { weightClass, classGroup, dateOfBirth, belt } = body

    let dataToUpdate: any = {
      weightClass,
      classGroup,
    }

    if (belt) {
      dataToUpdate.belt = belt;
    }

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth)
      const today = new Date()
      let calculatedAge = today.getFullYear() - dob.getFullYear()
      const m = today.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          calculatedAge--
      }

      dataToUpdate.dateOfBirth = dob
      dataToUpdate.age = calculatedAge
    }

    const updated = await prisma.athlete.update({
      where: { id: athleteId },
      data: dataToUpdate
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal update atlet" }, { status: 500 })
  }
}
