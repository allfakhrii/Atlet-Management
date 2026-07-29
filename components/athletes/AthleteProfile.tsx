"use client";

import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { Settings2, X } from 'lucide-react';

export default function AthleteProfile({ data, role }: { data?: any, role?: string }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    power: data?.radarAttributes?.power || 0,
    speed: data?.radarAttributes?.speed || 0,
    stamina: data?.radarAttributes?.stamina || 0,
    agility: data?.radarAttributes?.agility || 0,
    technique: data?.radarAttributes?.technique || 0,
    defense: data?.radarAttributes?.defense || 0,
    headshotAcc: data?.combatStats?.headshotAcc || 0,
    bodyKickAcc: data?.combatStats?.bodyKickAcc || 0,
    blockPercentage: data?.combatStats?.blockPercentage || 0,
    fouls: data?.combatStats?.fouls || 0,
  });

  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/athletes/${data.id}/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats)
      });
      if (res.ok) {
        alert("Statistik berhasil diperbarui!");
        window.location.reload();
      } else {
        alert("Gagal memperbarui statistik");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const athleteData = data || {
    id: "ATH-001",
    name: "Unknown Athlete",
    age: 0,
    weightClass: "Unknown",
    overallRating: 0,
    status: "Pending"
  };

  const radarData = data?.radarAttributes ? [
    { attribute: 'Power', value: stats.power, fullMark: 100 },
    { attribute: 'Speed', value: stats.speed, fullMark: 100 },
    { attribute: 'Stamina', value: stats.stamina, fullMark: 100 },
    { attribute: 'Agility', value: stats.agility, fullMark: 100 },
    { attribute: 'Technique', value: stats.technique, fullMark: 100 },
    { attribute: 'Defense', value: stats.defense, fullMark: 100 },
  ] : [
    { attribute: 'Power', value: 0, fullMark: 100 },
    { attribute: 'Speed', value: 0, fullMark: 100 },
    { attribute: 'Stamina', value: 0, fullMark: 100 },
    { attribute: 'Agility', value: 0, fullMark: 100 },
    { attribute: 'Technique', value: 0, fullMark: 100 },
    { attribute: 'Defense', value: 0, fullMark: 100 },
  ];

  const physicalMetricsData = data?.physicalMetrics?.length > 0 ? data.physicalMetrics.map((m: any) => {
    const dateObj = new Date(m.date)
    const displayDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : m.date
    return {
      date: displayDate,
      bpm: m.bpm,
      pace: m.runningPace
    }
  }) : [];

  const combatStats = {
    headshotAcc: stats.headshotAcc,
    bodyKickAcc: stats.bodyKickAcc,
    blockPercentage: stats.blockPercentage,
    fouls: stats.fouls
  };

  return (
    <div className="w-full">
      {/* Edit Modal for Admin */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl max-w-4xl w-full my-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Update Statistik & Atribut</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleUpdateStats} className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Radar Attributes (0-100)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['power', 'speed', 'stamina', 'agility', 'technique', 'defense'].map((attr) => (
                    <div key={attr}>
                      <label className="block text-sm font-medium text-slate-400 capitalize mb-1">{attr}</label>
                      <input 
                        type="number" min="0" max="100" required
                        value={(stats as any)[attr]} 
                        onChange={e => setStats({...stats, [attr]: Number(e.target.value)})}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:border-cyan-500" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">Combat Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Headshot Acc. (%)</label>
                    <input type="number" min="0" max="100" required value={stats.headshotAcc} onChange={e => setStats({...stats, headshotAcc: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Body Kick Acc. (%)</label>
                    <input type="number" min="0" max="100" required value={stats.bodyKickAcc} onChange={e => setStats({...stats, bodyKickAcc: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Block Percentage (%)</label>
                    <input type="number" min="0" max="100" required value={stats.blockPercentage} onChange={e => setStats({...stats, blockPercentage: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Total Fouls</label>
                    <input type="number" min="0" required value={stats.fouls} onChange={e => setStats({...stats, fouls: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800 gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 text-slate-400 font-medium hover:text-white">Batal</button>
                <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition-colors disabled:opacity-50">
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Header Profile & Status */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/60 mb-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black border-4 border-slate-900 shadow-xl shadow-cyan-900/40 relative">
            {athleteData.overallRating}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">{athleteData.name}</h1>
            <p className="text-slate-400 font-medium">{athleteData.weightClass} • {athleteData.age} Years Old</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Condition: {athleteData.status}
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex flex-wrap gap-4 justify-center md:justify-end">
          {role === "ADMIN" && (
            <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl text-sm font-bold transition-all border border-emerald-500/30">
              <Settings2 className="w-4 h-4" /> Update Stats
            </button>
          )}
          <button className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition-all border border-slate-600 hover:border-slate-500 text-white">
            Export PDF
          </button>
          <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5">
            Compare Data
          </button>
        </div>
      </div>

      {/* 2. Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. Hexagonal Radar Chart */}
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/60 flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-100">Attribute Assessment</h2>
            <p className="text-xs text-slate-400 mt-1">Hexagonal balance analysis based on recent sparring.</p>
          </div>
          <div className="flex-1 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="attribute" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Attributes"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fill="#06b6d4"
                  fillOpacity={0.3}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. Time-Series Line Chart */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/60 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-100">Cardio Endurance (Pace vs HR)</h2>
            <p className="text-xs text-slate-400 mt-1">Tracking average running pace (min/km) against Heart Rate (BPM).</p>
          </div>
          <div className="flex-1 min-h-[320px]">
            {physicalMetricsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={physicalMetricsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="bpm" name="Avg BPM" stroke="#f43f5e" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#1e293b' }} activeDot={{ r: 8, fill: '#f43f5e' }} />
                  <Line yAxisId="right" type="monotone" dataKey="pace" name="Pace (min/km)" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#1e293b' }} activeDot={{ r: 8, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Belum ada data latihan (Training Logs) untuk atlet ini.
              </div>
            )}
          </div>
        </div>

        {/* C. Combat Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-5 mt-2">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Headshot Acc. (3-Pts)</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-cyan-400">{combatStats.headshotAcc}%</h3>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Body Kick Acc. (2-Pts)</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-blue-400">{combatStats.bodyKickAcc}%</h3>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Block Percentage</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-emerald-400">{combatStats.blockPercentage}%</h3>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-rose-900/30 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Fouls (Kyong-go)</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-rose-500">{combatStats.fouls}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
