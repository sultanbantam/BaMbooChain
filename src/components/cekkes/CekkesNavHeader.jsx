import React from 'react';
import { 
  Heart, 
  Activity, 
  User, 
  Dog, 
  Leaf, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles, 
  FileText,
  AlertCircle
} from 'lucide-react';

const CekkesNavHeader = ({ 
  activeTab, 
  onSelectTab, 
  onOpenAddModal, 
  onOpenAiModal, 
  stats 
}) => {
  const tabs = [
    { id: 'all', label: 'Semua Profil', icon: <Activity size={16} />, count: stats?.total || 0 },
    { id: 'human', label: 'Manusia (Human)', icon: <User size={16} />, count: stats?.human || 0 },
    { id: 'animal', label: 'Hewan (Animal)', icon: <Dog size={16} />, count: stats?.animal || 0 },
    { id: 'plant', label: 'Tumbuhan (Plant)', icon: <Leaf size={16} />, count: stats?.plant || 0 },
    { id: 'schedule', label: 'Jadwal & Pengingat', icon: <Calendar size={16} />, count: stats?.carePlans || 0 },
    { id: 'audit', label: 'Audit & UU PDP', icon: <ShieldCheck size={16} />, count: stats?.auditLogs || 0 },
  ];

  return (
    <div className="cekkes-nav-header bg-gradient-to-b from-emerald-950/40 via-gray-900/80 to-transparent border-b border-emerald-500/20 pt-6 pb-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Heart size={12} className="text-emerald-400 animate-pulse" />
                ceKKes v1.0 MVP
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <ShieldCheck size={11} />
                Non-Diagnostik • UU PDP No. 27/2022
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              ceKKes <span className="text-emerald-400 text-lg sm:text-xl font-normal">— Cek Kesehatan Terpadu</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              <strong className="text-emerald-300 font-semibold">"Kenali. Pantau. Rawat."</strong> Platform Informasi Biologis & Monitoring Terpadu 3 Alam (Manusia, Hewan, Tumbuhan)
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md shadow-emerald-900/30 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles size={16} className="text-amber-200" />
              <span>Cek dengan AI</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>+ Tambah Profil</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-emerald-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-emerald-900/40 text-emerald-950' : 'bg-gray-700 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CekkesNavHeader;
