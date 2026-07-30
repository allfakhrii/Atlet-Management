import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

const ADMIN_SECRET = "COACHRIZAL2026"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, role, secretCode, weightClass, classGroup, gender, dateOfBirth, belt } = body

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
      if (!weightClass || !dateOfBirth) {
         return NextResponse.json({ message: "Kelas berat dan tanggal lahir wajib diisi untuk atlet" }, { status: 400 })
      }
      
      // Hitung Umur dari Tanggal Lahir
      const dob = new Date(dateOfBirth)
      
      if (isNaN(dob.getTime())) {
        return NextResponse.json({ message: "Format tanggal lahir tidak valid. Harap isi dengan lengkap (termasuk tahun)." }, { status: 400 })
      }

      const today = new Date()
      let calculatedAge = today.getFullYear() - dob.getFullYear()
      
      // Validasi tahun lahir agar masuk akal
      if (dob.getFullYear() < 1900 || dob.getFullYear() > today.getFullYear()) {
        return NextResponse.json({ message: "Tahun kelahiran tidak valid. Harap masukkan tahun yang benar." }, { status: 400 })
      }

      const m = today.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          calculatedAge--
      }

      // Buat profile Athlete sekaligus User
      createdUser = await prisma.$transaction(async (tx) => {
        const athlete = await tx.athlete.create({
          data: {
            name,
            age: calculatedAge,
            dateOfBirth: dob,
            weightClass,
            classGroup: classGroup || "Reguler",
            gender: gender || "Laki-laki",
            belt: belt || "Putih",
            overallRating: 0,
            status: "Active",
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
