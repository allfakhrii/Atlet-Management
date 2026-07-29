import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Overview Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, Coach Rizal. Here's what's happening with your team today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 className="text-slate-400 font-medium">Team Average Rating</h3>
          <p className="text-4xl font-black text-white mt-2">84<span className="text-xl text-slate-500 font-medium">/99</span></p>
          <p className="text-emerald-400 text-sm mt-2 font-medium">↑ 2.4% from last month</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 className="text-slate-400 font-medium">Athletes in Prime</h3>
          <p className="text-4xl font-black text-white mt-2">12</p>
          <p className="text-slate-400 text-sm mt-2 font-medium">Out of 24 active roster</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-rose-900/40 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 className="text-slate-400 font-medium">Overtraining Risk Alerts</h3>
          <p className="text-4xl font-black text-rose-500 mt-2">2</p>
          <p className="text-rose-400 text-sm mt-2 font-medium">Action required</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-700/60 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Top 5 Athletes Leaderboard</h2>
          <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-sm">
              <tr>
                <th className="py-4 px-6 font-medium">Athlete</th>
                <th className="py-4 px-6 font-medium">Weight Class</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Overall</th>
                <th className="py-4 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                      <span className="font-semibold text-slate-200">Athlete {i}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">Bantam (-63kg)</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">Prime</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-cyan-400">88</td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/athletes/dummy-${i}`} className="text-sm font-medium bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Analyze
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
