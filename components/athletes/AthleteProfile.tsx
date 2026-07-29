"use client";

import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';

export default function AthleteProfile({ data }: { data?: any }) {
  // Jika tidak ada data dari backend (dummy mode)
  const athleteData = data || {
    id: "ATH-001",
    name: "Rizal (Dummy)",
    age: 22,
    weight_class: "Bantam (-63kg)",
    overall_rating: 88,
    status: "Prime"
  };

  const radarData = data?.radar_attributes ? [
    { attribute: 'Power', value: data.radar_attributes.power, fullMark: 100 },
    { attribute: 'Speed', value: data.radar_attributes.speed, fullMark: 100 },
    { attribute: 'Stamina', value: data.radar_attributes.stamina, fullMark: 100 },
    { attribute: 'Agility', value: data.radar_attributes.agility, fullMark: 100 },
    { attribute: 'Technique', value: data.radar_attributes.technique, fullMark: 100 },
    { attribute: 'Defense', value: data.radar_attributes.defense, fullMark: 100 },
  ] : [
    { attribute: 'Power', value: 85, fullMark: 100 },
    { attribute: 'Speed', value: 92, fullMark: 100 },
    { attribute: 'Stamina', value: 78, fullMark: 100 },
    { attribute: 'Agility', value: 90, fullMark: 100 },
    { attribute: 'Technique', value: 88, fullMark: 100 },
    { attribute: 'Defense', value: 75, fullMark: 100 },
  ];

  const physicalMetricsData = data?.physical_metrics || [
    { date: 'Oct', bpm: 165, pace: 5.2 },
    { date: 'Nov', bpm: 158, pace: 5.0 },
    { date: 'Dec', bpm: 155, pace: 4.8 },
    { date: 'Jan', bpm: 152, pace: 4.5 },
  ];

  const combatStats = data?.combat_stats || {
    headshot_acc: 45,
    body_kick_acc: 72,
    block_percentage: 65,
    fouls: 2
  };

  return (
    <div className="w-full">
      {/* 1. Header Profile & Status */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/60 mb-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black border-4 border-slate-900 shadow-xl shadow-cyan-900/40 relative">
            {athleteData.overall_rating}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">{athleteData.name}</h1>
            <p className="text-slate-400 font-medium">{athleteData.weight_class} • {athleteData.age} Years Old</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Condition: {athleteData.status}
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4">
          <button className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition-all border border-slate-600 hover:border-slate-500">
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
          </div>
        </div>

        {/* C. Combat Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-5 mt-2">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Headshot Acc. (3-Pts)</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-cyan-400">{combatStats.headshot_acc}%</h3>
              <span className="text-xs font-bold text-emerald-400 mb-1">+5% MoM</span>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Body Kick Acc. (2-Pts)</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-blue-400">{combatStats.body_kick_acc}%</h3>
              <span className="text-xs font-medium text-slate-500 mb-1">Avg 68%</span>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Block Percentage</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-emerald-400">{combatStats.block_percentage}%</h3>
              <span className="text-xs font-bold text-emerald-400 mb-1">Solid Defense</span>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-rose-900/30 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-semibold mb-1">Fouls (Kyong-go)</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-black text-rose-500">{combatStats.fouls}</h3>
              <span className="text-xs font-medium text-rose-400 mb-1">Last 3 Matches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
