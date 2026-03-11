import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Download,
  Calendar
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/attendance");
        setAttendanceData(res.data.data || []);
      } catch (err) {
        console.error("API ERROR (fetchAttendance):", err);
        setAttendanceData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const getStatusColor = (percent) => {
    if (percent >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (percent >= 75) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Attendance Monitoring</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Attendance Analytics</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Real-time subject-wise presence tracking system.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-[#355c7d] border border-gray-200 px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
          <Download size={18} /> Download Summary Report
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Presence</p>
            <p className="text-3xl font-black text-[#2c2c2c]">88.4%</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300 border-b-4 border-b-transparent hover:border-b-[#355c7d]/20">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session Hours</p>
            <p className="text-3xl font-black text-[#2c2c2c]">480 hrs</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300 border-b-4 border-b-transparent hover:border-b-rose-500/20">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shortage Flag</p>
            <p className="text-3xl font-black text-[#2c2c2c]">12 Students</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {/* Search & Utility */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-6 items-center justify-between bg-gray-50/50">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by ID, name or subject code..."
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-[18px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 text-[#2c2c2c] bg-white rounded-[16px] border border-gray-200 hover:bg-gray-50 hover:border-[#355c7d]/30 transition-all text-xs font-black uppercase tracking-widest">
            <Calendar size={18} className="text-gray-400" /> Current Academic Cycle
          </button>
        </div>

        {/* Attendance Registry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
                <th className="px-8 py-5">Enrollment ID</th>
                <th className="px-8 py-5">Student Identity</th>
                <th className="px-8 py-5">Course Code</th>
                <th className="px-6 py-5 text-center">Contact Hours</th>
                <th className="px-8 py-5 text-center">Presence Index</th>
                <th className="px-8 py-5 text-center">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                   <td colSpan="6" className="px-8 py-20 text-center text-gray-400 italic font-medium uppercase tracking-widest text-xs">Computing attendance matrices...</td>
                </tr>
              ) : (!attendanceData || attendanceData.length === 0) ? (
                <tr>
                   <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                         <Calendar size={40} className="text-gray-300" />
                         <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">No active records indexed</p>
                      </div>
                   </td>
                </tr>
              ) : (
                attendanceData.map((record, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition-all group duration-300">
                    <td className="px-8 py-6">
                      <span className="text-sm font-mono text-[#355c7d] font-bold tracking-tight">{record.regNo}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[15px] font-black text-[#2c2c2c] tracking-tight group-hover:text-[#355c7d] transition-colors">{record.studentName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex px-3 py-1 bg-[#355c7d]/5 text-[#355c7d] text-[10px] font-black uppercase tracking-widest rounded-lg">{record.subject}</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-flex px-2.5 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 border border-gray-100">{record.hoursConducted} HRS</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`text-sm font-black ${record.percentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {record.percentage}%
                        </span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ${record.percentage < 75 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}
                            style={{ width: `${record.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-3.5 py-1.5 rounded-[12px] text-[9px] border font-black uppercase tracking-widest shadow-sm ${getStatusColor(record.percentage)}`}>
                          {record.eligibility}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
