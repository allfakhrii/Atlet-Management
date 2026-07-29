import prisma from '@/lib/prisma'
import AthleteProfile from '@/components/athletes/AthleteProfile'
import { notFound } from 'next/navigation'

export default async function AthletePage({ params }: { params: { id: string } }) {
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
      <AthleteProfile data={athlete} />
    </div>
  )
}
