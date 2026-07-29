import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// GET /api/attendance?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ message: "Date is required" }, { status: 400 })
  }

  try {
    // Fetch all active athletes
    const athletes = await prisma.athlete.findMany({
      where: { status: "Active" },
      select: {
        id: true,
        name: true,
        classGroup: true,
        attendances: {
          where: { date }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(athletes)
  } catch (error) {
    console.error("GET Attendance Error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/attendance
// Body: { athleteId, date, isPresent }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const { athleteId, date, isPresent } = await req.json()

    if (!athleteId || !date || typeof isPresent !== "boolean") {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const record = await prisma.attendance.upsert({
      where: {
        athleteId_date: {
          athleteId,
          date
        }
      },
      update: {
        isPresent
      },
      create: {
        athleteId,
        date,
        isPresent
      }
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error("POST Attendance Error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
