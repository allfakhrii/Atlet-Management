import AthleteProfile from '@/components/athletes/AthleteProfile'

export default function AthletePage({ params }: { params: { id: string } }) {
  // Dalam implementasi nyata, kita akan mengambil data dari Supabase di sini:
  // const supabase = createClient()
  // const { data } = await supabase.from('athletes').select('...').eq('id', params.id).single()
  
  // Untuk saat ini, kita mengandalkan dummy data di AthleteProfile
  return (
    <div className="w-full">
      <div className="mb-6">
        <button className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2 mb-4">
          ← Back to Dashboard
        </button>
      </div>
      <AthleteProfile />
    </div>
  )
}
