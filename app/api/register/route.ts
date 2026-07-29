import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

const ADMIN_SECRET = "COACHRIZAL2026"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, role, secretCode, weightClass, classGroup, age } = body

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Semua kolom wajib diisi" }, { status: 400 })
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 })
    }

    // Validasi role
    if (role === Role.ADMIN) {
      if (secretCode !== ADMIN_SECRET) {
        return NextResponse.json({ message: "Kode Rahasia Admin salah!" }, { status: 403 })
      }
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10)

    let createdUser;
    
    // Transaksi jika role ATHLETE
    if (role === Role.ATHLETE) {
      if (!weightClass || !age) {
         return NextResponse.json({ message: "Kelas berat dan umur wajib diisi untuk atlet" }, { status: 400 })
      }
      
      // Buat profile Athlete sekaligus User
      createdUser = await prisma.$transaction(async (tx) => {
        const athlete = await tx.athlete.create({
          data: {
            name,
            age: parseInt(age),
            weightClass,
            classGroup: classGroup || "Reguler",
            overallRating: 50, // Default awal
            status: "Pending",
          }
        })

        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: Role.ATHLETE,
            isApproved: false, // Menunggu persetujuan
            athleteId: athlete.id
          }
        })
        return user
      })
    } else {
      // Role ADMIN
      createdUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.ADMIN,
          isApproved: true, // Admin langsung approved
        }
      })
    }

    return NextResponse.json({ message: "Registrasi berhasil" }, { status: 201 })
  } catch (error) {
    console.error("Registrasi Error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
