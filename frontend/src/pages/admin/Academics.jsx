import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, BookOpen, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Academics = () => {
  const [academics, setAcademics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(fetchAcademics, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchAcademics = async () => {
    setIsLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/academics?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setAcademics(data?.data || []);
    } catch (err) {
      console.error('API ERROR (fetchAcademics):', err);
      setAcademics([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRecords = academics.length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Academic Performance</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Internal Assessments</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Anna University Assessment Tracking & Monitoring Cabinet.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-[#355c7d] border border-gray-200 px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
          <Download size={18} /> Export Performance Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><BookOpen size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Records</p>
            <p className="text-3xl font-black text-[#2c2c2c]">{totalRecords}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300 border-b-4 border-b-transparent hover:border-b-emerald-500/20">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><Award size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unique Students</p>
            <p className="text-3xl font-black text-[#2c2c2c]">
              {new Set(academics.map(r => r.regNo)).size}
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300 border-b-4 border-b-transparent hover:border-b-purple-500/20">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform"><TrendingUp size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subject Volume</p>
            <p className="text-3xl font-black text-[#2c2c2c]">
              {new Set(academics.map(r => r.subject || r.subjectCode)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-6 items-center justify-between bg-gray-50/50">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by profile, register ID or subject..."
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-[18px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 text-[#2c2c2c] bg-white rounded-[16px] border border-gray-200 hover:bg-gray-50 hover:border-[#355c7d]/30 transition-all text-xs font-black uppercase tracking-widest">
            <Filter size={18} className="text-gray-400" /> Filter Semester
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
                <th className="px-6 py-5">Enrollment ID</th>
                <th className="px-6 py-5">Full Name</th>
                <th className="px-6 py-5">Subject Details</th>
                <th className="px-4 py-5 text-center">SEM</th>
                <th className="px-4 py-5 text-center">C1</th>
                <th className="px-4 py-5 text-center">C2</th>
                <th className="px-4 py-5 text-center">INT1</th>
                <th className="px-4 py-5 text-center">INT2</th>
                <th className="px-4 py-5 text-center">MOD</th>
                <th className="px-6 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                   <td colSpan="10" className="px-8 py-20 text-center text-gray-400 italic font-medium uppercase tracking-widest text-xs">Synchronizing assessment records...</td>
                </tr>
              ) : academics.length === 0 ? (
                <tr>
                   <td colSpan="10" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                         <BookOpen size={40} className="text-gray-300" />
                         <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">No assessment data indexed</p>
                      </div>
                   </td>
                </tr>
              ) : (
                academics.map((rec, i) => {
                  const total = (rec.marks > 0)
                    ? rec.marks
                    : (rec.internal1 || 0) + (rec.internal2 || 0);
                  const passed = total >= 50 || rec.marks >= 50 || rec.internal1 >= 10 || rec.modelExam >= 40;

                  return (
                    <tr key={rec._id || i} className="hover:bg-gray-50/80 transition-all group">
                      <td className="px-6 py-5 font-mono font-bold text-[#355c7d] text-xs">
                        {rec.regNo}
                      </td>
                      <td className="px-6 py-5 font-black text-[#2c2c2c] text-[14px] tracking-tight group-hover:text-[#355c7d] transition-colors">
                        {rec.studentName || '—'}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-[#355c7d] uppercase tracking-widest leading-none mb-1">{rec.subjectCode || 'U/N'}</span>
                          <span className="text-xs text-gray-500 font-bold truncate max-w-[140px] tracking-tight">{rec.subject || rec.subjectName || rec.subjectCode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <span className="inline-flex px-2.5 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500">S{rec.semester}</span>
                      </td>
                      <td className="px-4 py-5 text-center font-bold text-gray-600 text-sm">{rec.cycleTest1 ?? '—'}</td>
                      <td className="px-4 py-5 text-center font-bold text-gray-600 text-sm">{rec.cycleTest2 ?? '—'}</td>
                      <td className="px-4 py-5 text-center font-black text-[#355c7d] text-sm">{rec.internal1 ?? '—'}</td>
                      <td className="px-4 py-5 text-center font-black text-[#355c7d] text-sm">{rec.internal2 ?? '—'}</td>
                      <td className="px-4 py-5 text-center font-black text-emerald-600 text-sm">{rec.modelExam ?? '—'}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-[10px] text-[9px] font-black uppercase tracking-widest ${passed ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-rose-50 text-rose-500 ring-1 ring-rose-500/20'}`}>
                          {rec.marks > 0 ? `MARK: ${rec.marks}` : passed ? 'QUALIFIED' : 'UNGRADED'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Academics;
