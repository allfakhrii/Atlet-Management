import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Buat Atlet pertama
  const athlete = await prisma.athlete.create({
    data: {
      name: 'Rizal',
      age: 22,
      weightClass: 'Bantam (-63kg)',
      overallRating: 88,
      status: 'Prime',
      
      // Relasi bersarang (Nested Writes)
      combatStats: {
        create: {
          headshotAcc: 45.0,
          bodyKickAcc: 72.0,
          blockPercentage: 65.0,
          fouls: 2
        }
      },
      radarAttributes: {
        create: {
          power: 85,
          speed: 92,
          stamina: 78,
          agility: 90,
          technique: 88,
          defense: 75
        }
      },
      physicalMetrics: {
        create: [
          { date: 'Oct', bpm: 165, runningPace: 5.2, impactForce: 800, restHours: 8 },
          { date: 'Nov', bpm: 158, runningPace: 5.0, impactForce: 820, restHours: 8 },
          { date: 'Dec', bpm: 155, runningPace: 4.8, impactForce: 850, restHours: 7.5 },
          { date: 'Jan', bpm: 152, runningPace: 4.5, impactForce: 900, restHours: 8 }
        ]
      }
    }
  })

  console.log('✅ Atlet berhasil dibuat dengan ID:', athlete.id)
  console.log('Silakan copy ID ini untuk ditaruh di URL browser!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
