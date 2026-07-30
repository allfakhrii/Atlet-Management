"use client";

import React, { useState, useRef } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { Settings2, X, Download, Users as UsersIcon, Loader2, Swords, Trophy, Medal, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import BeltIcon from './BeltIcon';

export default function AthleteProfile({ data, role }: { data?: any, role?: string }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // States for Compare Data
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareAthletes, setCompareAthletes] = useState<any[]>([]);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>("");
  const [opponentData, setOpponentData] = useState<any>(null);
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const openCompareModal = async () => {
    setShowCompareModal(true);
    if (compareAthletes.length === 0) {
      setLoadingAthletes(true);
      try {
        const res = await fetch(`/api/athletes?excludeId=${data.id}`);
        const list = await res.json();
        setCompareAthletes(list);
      } catch (err) {
        console.error("Failed to load athletes for comparison", err);
      } finally {
        setLoadingAthletes(false);
      }
    }
  };

  const handleSelectOpponent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const oppId = e.target.value;
    setSelectedOpponentId(oppId);
    if (oppId) {
      const opp = compareAthletes.find(a => a.id === oppId);
      setOpponentData(opp);
    } else {
      setOpponentData(null);
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: '#0f172a', // match slate-950/slate-900 theme
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${athleteData.name.replace(/\s+/g, '_')}_Analytics_Report.pdf`);
    } catch (error) {
      console.error("Failed to export PDF", error);
      alert("Gagal mengekspor PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const athleteData = data || {
    id: "ATH-001",
    name: "Unknown Athlete",
    age: 0,
    weightClass: "Unknown",
    overallRating: 0,
    status: "Pending",
    belt: "Putih"
  };

  const getAttribute = (source: any, key: string) => source?.[key] || 0;

  const radarData = data?.radarAttributes ? [
    { attribute: 'Power', value: stats.power, value2: opponentData ? getAttribute(opponentData.radarAttributes, 'power') : undefined, fullMark: 100 },
    { attribute: 'Speed', value: stats.speed, value2: opponentData ? getAttribute(opponentData.radarAttributes, 'speed') : undefined, fullMark: 100 },
    { attribute: 'Stamina', value: stats.stamina, value2: opponentData ? getAttribute(opponentData.radarAttributes, 'stamina') : undefined, fullMark: 100 },
    { attribute: 'Agility', value: stats.agility, value2: opponentData ? getAttribute(opponentData.radarAttributes, 'agility') : undefined, fullMark: 100 },
    { attribute: 'Technique', value: stats.technique, value2: opponentData ? getAttribute(opponentData.radarAttributes, 'technique') : undefined, fullMark: 100 },
    { attribute: 'Defense', value: stats.defense, value2: opponentData ? getAttribute(opponentData.radarAttributes, 'defense') : undefined, fullMark: 100 },
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

  const medals = {
    gold: data?.tournamentParticipations?.filter((p: any) => p.medal === 'Emas').length || 0,
    silver: data?.tournamentParticipations?.filter((p: any) => p.medal === 'Perak').length || 0,
    bronze: data?.tournamentParticipations?.filter((p: any) => p.medal === 'Perunggu').length || 0,
  };

  return (
    <div className="w-full">
      {/* Edit Modal for Admin */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-sm w-full relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Update Base Stats</h2>
            
            <form onSubmit={handleUpdateStats} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(stats).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-400 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={(stats as any)[key]}
                      onChange={(e) => setStats({...stats, [key]: Number(e.target.value)})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 text-slate-400 font-medium hover:text-white">Batal</button>
                <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition-colors disabled:opacity-50">
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { setShowCompareModal(false); setOpponentData(null); setSelectedOpponentId(""); }}
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Compare Athlete</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-400">Pilih atlet untuk disandingkan dengan <strong>{athleteData.name}</strong> di Radar Chart dan perbandingan statistik tempur.</p>
              
              {loadingAthletes ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
              ) : (
                <select 
                  value={selectedOpponentId}
                  onChange={handleSelectOpponent}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="">Pilih Lawan (Opponent)...</option>
                  {compareAthletes.map(a => (
                    <option key={a.id} value={a.id}>{a.name} - {a.weightClass}</option>
                  ))}
                </select>
              )}

              {opponentData && (
                <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm">
                  <p className="text-slate-300">Anda sedang membandingkan:</p>
                  <div className="flex items-center gap-4 mt-2 font-bold">
                    <span className="text-cyan-400">{athleteData.name}</span>
                    <span className="text-slate-500">VS</span>
                    <span className="text-purple-400">{opponentData.name}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setShowCompareModal(false)}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-purple-600/20"
              >
                Terapkan Komparasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wrapping the main content in a div with a ref for PDF Export */}
      <div ref={reportRef} className="bg-slate-950 p-2 md:p-4 rounded-3xl">
        {/* 1. Header Profile & Status */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/60 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black border-4 border-slate-900 shadow-xl shadow-cyan-900/40 relative">
              {athleteData.overallRating}
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">{athleteData.name}</h1>
              <p className="text-slate-400 font-medium">{athleteData.weightClass} • {athleteData.gender || 'Laki-laki'} • {athleteData.age} Years Old</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  Condition: {athleteData.status}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
                  <BeltIcon belt={athleteData.belt} className="w-5 h-5" />
                  {athleteData.belt}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-wrap gap-4 justify-center md:justify-end print-hide" data-html2canvas-ignore="true">
            {role === "ADMIN" && (
              <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl text-sm font-bold transition-all border border-emerald-500/30">
                <Settings2 className="w-4 h-4" /> Update Stats
              </button>
            )}
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition-all border border-slate-600 hover:border-slate-500 text-white disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
            <button 
              onClick={openCompareModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5"
            >
              <UsersIcon className="w-4 h-4" />
              {opponentData ? "Change Opponent" : "Compare Data"}
            </button>
          </div>
        </div>

        {/* 1.5. Medal Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 font-semibold text-sm">Gold</p>
              <p className="text-3xl font-black text-white mt-1">{medals.gold}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <span className="text-2xl">🥇</span>
            </div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 font-semibold text-sm">Silver</p>
              <p className="text-3xl font-black text-white mt-1">{medals.silver}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-300/10 flex items-center justify-center border border-slate-300/20">
              <span className="text-2xl">🥈</span>
            </div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 font-semibold text-sm">Bronze</p>
              <p className="text-3xl font-black text-white mt-1">{medals.bronze}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-700/10 flex items-center justify-center border border-amber-700/30">
              <span className="text-2xl">🥉</span>
            </div>
          </div>
        </div>

        {/* 2. Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* A. Hexagonal Radar Chart */}
          <div className="lg:col-span-1 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/60 flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-100">Attribute Assessment</h2>
              <p className="text-xs text-slate-400 mt-1">
                {opponentData ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> {athleteData.name} vs 
                    <span className="w-2 h-2 rounded-full bg-purple-400 ml-2"></span> {opponentData.name}
                  </span>
                ) : (
                  "Hexagonal balance analysis based on recent sparring."
                )}
              </p>
            </div>
            <div className="flex-1 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="attribute" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  
                  <Radar
                    name={athleteData.name}
                    dataKey="value"
                    stroke="#06b6d4" // Cyan
                    strokeWidth={3}
                    fill="#06b6d4"
                    fillOpacity={0.3}
                  />
                  {opponentData && (
                    <Radar
                      name={opponentData.name}
                      dataKey="value2"
                      stroke="#c084fc" // Purple
                      strokeWidth={3}
                      fill="#c084fc"
                      fillOpacity={0.3}
                    />
                  )}
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ fontWeight: 'bold' }}
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
              <div className="flex flex-col gap-1 mt-2">
                <h3 className="text-4xl font-black text-cyan-400">{combatStats.headshotAcc}%</h3>
                {opponentData && (
                  <p className="text-sm font-medium text-purple-400 border-t border-slate-700 pt-1">
                    VS {getAttribute(opponentData.combatStats, 'headshotAcc')}%
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-slate-400 text-sm font-semibold mb-1">Body Kick Acc. (2-Pts)</p>
              <div className="flex flex-col gap-1 mt-2">
                <h3 className="text-4xl font-black text-blue-400">{combatStats.bodyKickAcc}%</h3>
                {opponentData && (
                  <p className="text-sm font-medium text-purple-400 border-t border-slate-700 pt-1">
                    VS {getAttribute(opponentData.combatStats, 'bodyKickAcc')}%
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-slate-400 text-sm font-semibold mb-1">Block Percentage</p>
              <div className="flex flex-col gap-1 mt-2">
                <h3 className="text-4xl font-black text-emerald-400">{combatStats.blockPercentage}%</h3>
                {opponentData && (
                  <p className="text-sm font-medium text-purple-400 border-t border-slate-700 pt-1">
                    VS {getAttribute(opponentData.combatStats, 'blockPercentage')}%
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl border border-rose-900/30 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-slate-400 text-sm font-semibold mb-1">Fouls (Kyong-go)</p>
              <div className="flex flex-col gap-1 mt-2">
                <h3 className="text-4xl font-black text-rose-500">{combatStats.fouls}</h3>
                {opponentData && (
                  <p className="text-sm font-medium text-purple-400 border-t border-slate-700 pt-1">
                    VS {getAttribute(opponentData.combatStats, 'fouls')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tournament History & Achievements */}
        <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/60">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-amber-500" />
            Tournament History & Achievements
          </h2>

          {(!data?.tournamentParticipations || data.tournamentParticipations.length === 0) ? (
            <div className="py-8 text-center bg-slate-900/50 rounded-xl border border-slate-700/30">
              <p className="text-slate-500">Belum ada riwayat turnamen yang diikuti.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.tournamentParticipations.map((part: any) => (
                <div key={part.id} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/30 transition-colors flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight mb-2">
                      {part.tournament?.name || 'Unknown Tournament'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4">
                      <Calendar className="w-4 h-4 text-cyan-500" />
                      <span>{part.tournament?.date ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(part.tournament.date)) : '-'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-800 mt-auto flex items-center gap-2">
                    <Medal className={`w-5 h-5 ${
                      part.medal === 'Emas' ? 'text-yellow-500' :
                      part.medal === 'Perak' ? 'text-slate-300' :
                      part.medal === 'Perunggu' ? 'text-amber-600' :
                      'text-slate-600'
                    }`} />
                    <span className={`font-bold text-sm ${
                      part.medal === 'Emas' ? 'text-yellow-500' :
                      part.medal === 'Perak' ? 'text-slate-300' :
                      part.medal === 'Perunggu' ? 'text-amber-600' :
                      'text-slate-500'
                    }`}>
                      {part.medal ? `Juara - Medali ${part.medal}` : 'Participant'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Match History */}
        <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700/60">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
            <Swords className="w-6 h-6 text-cyan-500" />
            Match History
          </h2>

          {(!data?.matches || data.matches.length === 0) ? (
            <div className="py-8 text-center bg-slate-900/50 rounded-xl border border-slate-700/30">
              <p className="text-slate-500">Belum ada data pertandingan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.matches.map((match: any) => (
                <div key={match.id} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        match.result === 'Win' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {match.result}
                      </span>
                      <span className="font-bold text-white text-lg flex items-center gap-2">
                        vs {match.opponentName}
                      </span>
                    </div>
                    {match.score && (
                      <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-sm font-bold text-cyan-400">
                        {match.score}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="text-slate-300">{match.tournament?.name || 'Unknown Tournament'}</span>
                    </div>
                    {match.round && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">•</span>
                        <span>{match.round}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">•</span>
                      <span>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(match.date))}</span>
                    </div>
                  </div>

                  {match.notes && (
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-sm text-slate-300 italic">
                      "{match.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
