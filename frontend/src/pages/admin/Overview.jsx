import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  BookOpen,
  Bell,
  Calendar,
  Award
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[20px] overflow-hidden ${className}`}>
    {children}
  </div>
);

const OverviewCard = ({ title, value, icon: Icon, trend, color, subtext }) => (
  <GlassCard className="p-8 group hover:translate-y-[-6px] transition-all duration-500 border-b-4 border-b-transparent hover:border-b-[#355c7d]/20">
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={28} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowUpRight size={14} className="rotate-90" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-4xl font-black text-[#2c2c2c] tracking-tight">{value}</p>
      {subtext && <p className="text-[11px] text-gray-400 mt-3 font-semibold tracking-tight">{subtext}</p>}
    </div>
  </GlassCard>
);

const Overview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/analytics/overview`);
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to fetch dashboard analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#355c7d]/10 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-t-[#355c7d] rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing DAVIZ Neural Engine</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-200 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="w-8 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[11px] font-black text-[#355c7d] uppercase tracking-[0.4em]">Dashboard Hub</span>
          </div>
          <h1 className="text-5xl font-black text-[#2c2c2c] tracking-tighter">Overview</h1>
          <p className="text-gray-400 text-sm font-semibold mt-2 tracking-tight">Real-time performance and system health indicators.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
                   <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="avatar" />
                </div>
              ))}
           </div>
           <div className="h-10 w-px bg-gray-100 italic"></div>
           <div>
              <p className="text-[10px] font-black text-[#355c7d] uppercase tracking-widest leading-none mb-1">Synchronized</p>
              <p className="text-[11px] text-gray-400 font-bold">12 Active Sessions</p>
           </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <OverviewCard 
          title="Total Enrollment" 
          value={analytics.totalStudents || 0} 
          icon={Users} 
          trend={12} 
          color="bg-blue-500" 
          subtext="Verified Student Accounts"
        />
        <OverviewCard 
          title="Avg. Attendance" 
          value={`${analytics.averageAttendance || 0}%`} 
          icon={TrendingUp} 
          trend={3.4} 
          color="bg-emerald-500" 
          subtext="Institutional Average"
        />
        <OverviewCard 
          title="Academic Score" 
          value={analytics.averageMarks || 0} 
          icon={Award} 
          trend={5.2} 
          color="bg-purple-500" 
          subtext="Internal Quality Metric"
        />
        <OverviewCard 
          title="Active Subjects" 
          value={analytics.totalSubjects || 0} 
          icon={BookOpen} 
          trend={2} 
          color="bg-amber-500" 
          subtext="Course Catalog Volume"
        />
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 animate-in fade-in slide-in-from-bottom-8 delay-200 duration-1000">
        <GlassCard className="p-10 flex items-center justify-between group hover:shadow-2xl hover:shadow-[#355c7d]/5 transition-all cursor-pointer">
           <div className="flex items-center gap-8">
              <div className="p-6 bg-rose-50 text-rose-600 rounded-[24px] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                 <Calendar size={36} />
              </div>
              <div>
                 <h4 className="text-3xl font-black text-[#2c2c2c] tracking-tight">{analytics.upcomingExams || 0}</h4>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Upcoming Exams</p>
              </div>
           </div>
           <div className="p-4 bg-gray-50 rounded-2xl text-[#355c7d] group-hover:bg-[#355c7d] group-hover:text-white transition-all">
              <ArrowUpRight size={24} />
           </div>
        </GlassCard>

        <GlassCard className="p-10 flex items-center justify-between group hover:shadow-2xl hover:shadow-[#355c7d]/5 transition-all cursor-pointer">
           <div className="flex items-center gap-8">
              <div className="p-6 bg-amber-50 text-amber-600 rounded-[24px] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                 <Bell size={36} />
              </div>
              <div>
                 <h4 className="text-3xl font-black text-[#2c2c2c] tracking-tight">{analytics.notices || 0}</h4>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Active Notices</p>
              </div>
           </div>
           <div className="p-4 bg-gray-50 rounded-2xl text-[#355c7d] group-hover:bg-[#355c7d] group-hover:text-white transition-all">
              <ArrowUpRight size={24} />
           </div>
        </GlassCard>
      </div>

      {/* Interactive Footer Banner */}
      <div className="p-12 bg-[#355c7d] rounded-[32px] text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-[#355c7d]/30 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
         <div className="relative z-10">
            <h4 className="text-3xl font-black tracking-tighter mb-4 italic">GENERATE ANALYTICAL REPORTS</h4>
            <p className="text-white/70 text-sm font-medium max-w-xl leading-relaxed">
              Export comprehensive student data, attendance trends, and academic performance metrics instantly. Our automated reporting system ensures precision for institutional review.
            </p>
         </div>
         <button className="relative z-10 bg-white text-[#355c7d] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-amber-400 hover:text-black hover:scale-105 active:scale-95 transition-all duration-500 whitespace-nowrap">
            Download Report (PDF)
         </button>
      </div>
    </div>
  );
};

export default Overview;
