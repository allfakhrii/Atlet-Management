import prisma from '@/lib/prisma'
import AthleteProfile from '@/components/athletes/AthleteProfile'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function AthletePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }})
  const role = user?.role || "ATHLETE"

  const athlete = await prisma.athlete.findUnique({
    where: { id: params.id },
    include: {
      radarAttributes: true,
      combatStats: true,
      physicalMetrics: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!athlete) return notFound()

  return (
    <div className="w-full">
      <div className="mb-6">
        <button className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2 mb-4">
          ← Back to Dashboard
        </button>
      </div>
      <AthleteProfile data={athlete} role={role} />
    </div>
  )
}
