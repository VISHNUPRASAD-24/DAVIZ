import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { API_BASE_URL } from '../../config/api';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const OverviewCard = ({ title, value, icon: Icon, trend, color, subtext }) => (
  <GlassCard className="p-6 group hover:translate-y-[-4px] transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-20 text-${color.split('-')[1]}-600 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowUpRight size={12} className="rotate-90" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black text-gray-800 tracking-tighter">{value}</p>
      {subtext && <p className="text-[10px] text-gray-400 mt-2 font-medium italic">{subtext}</p>}
    </div>
  </GlassCard>
);

const AttendancePieChart = ({ data }) => {
  const COLORS = ['#0f3d3e', '#1a6b6d', '#289ba0', '#fbbf24'];
  
  return (
    <GlassCard className="p-8 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><PieChartIcon size={20} /></div>
        <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Attendance Spread</h2>
      </div>
      <div className="flex-1" style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {(data || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '16px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

const CgpaBarChart = ({ data }) => {
  return (
    <GlassCard className="p-8 flex flex-col h-full">
       <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><BarChart3 size={20} /></div>
        <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Academic Performance</h2>
      </div>
      <div className="flex-1" style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: '900'}} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: '900'}} />
            <Tooltip 
              cursor={{fill: '#f9fafb'}}
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '16px' }}
            />
            <Bar dataKey="value" fill="url(#barGradient)" radius={[10, 10, 0, 0]} barSize={50} animationDuration={2000}>
              {(data || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.15)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

const Overview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      console.log("Fetching SIS analytics from:", `${API_BASE_URL}/api/analytics/overview`);
      
      // Safety timeout to prevent infinite spinner
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn("Analytics fetch timed out, showing default state.");
          setAnalytics({
              totalStudents: 0,
              avgAttendance: 0,
              avgCGPA: 0,
              atRiskStudents: 0,
              distributions: { attendance: [], cgpa: [] }
          });
          setIsLoading(false);
        }
      }, 5000);

      try {
        const res = await fetch(`${API_BASE_URL}/api/analytics/overview`);
        const data = await res.json();
        console.log("Analytics data received:", data);
        setAnalytics(data);
        clearTimeout(timeoutId);
      } catch (err) {
        console.error("Failed to fetch dashboard analytics:", err);
        setAnalytics({
          totalStudents: 0,
          avgAttendance: 0,
          avgCGPA: 0,
          atRiskStudents: 0,
          distributions: { attendance: [], cgpa: [] }
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#0f3d3e]/10 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-t-[#0f3d3e] rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  const distributions = analytics.distributions || { attendance: [], cgpa: [] };

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-2 block">System Analytics</span>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter">Command Center</h1>
          <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest italic">Institutional Insight Engine v2.0</p>
        </div>
        <div className="flex gap-4">
           <GlassCard className="px-5 py-3 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse outline outline-4 outline-green-500/10"></span>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Live: Real-time Data Sync</span>
           </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewCard 
          title="Total Enrollment" 
          value={analytics.totalStudents || 0} 
          icon={Users} 
          trend={12} 
          color="bg-blue-500" 
          subtext="Active Academic Records"
        />
        <OverviewCard 
          title="Avg. Attendance" 
          value={`${analytics.avgAttendance || 0}%`} 
          icon={TrendingUp} 
          trend={3.4} 
          color="bg-emerald-500" 
          subtext="System-wide Average"
        />
        <OverviewCard 
          title="Avg. CGPA" 
          value={analytics.avgCGPA || '0.00'} 
          icon={GraduationCap} 
          trend={-0.2} 
          color="bg-purple-500" 
          subtext="Institutional GPA Index"
        />
        <OverviewCard 
          title="At Risk Students" 
          value={analytics.atRiskStudents || 0} 
          icon={AlertCircle} 
          trend={-15} 
          color="bg-red-500" 
          subtext="Attendance < 75%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
        <AttendancePieChart data={distributions.attendance || []} />
        <CgpaBarChart data={distributions.cgpa || []} />
      </div>

      {/* Analytics Footer Hint */}
      <GlassCard className="p-8 bg-gradient-to-r from-[#0f3d3e] to-[#1a6b6d] border-none text-white flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h4 className="text-xl font-black tracking-tight mb-2 uppercase">Proactive Student Monitoring</h4>
            <p className="text-white/60 text-xs font-medium max-w-lg leading-relaxed italic">
              Our advanced analytics engine identifies performance outliers and attendance drops automatically. Use the distribution charts above to pinpoint target groups for remedial sessions.
            </p>
         </div>
         <button className="bg-[#fbbf24] text-[#0f3d3e] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap">
            Generate Full Report
         </button>
      </GlassCard>
    </div>
  );
};

export default Overview;
