import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Bell, Megaphone, Send, Trash2, Filter, Star, Hash, Calendar, ChevronRight } from 'lucide-react';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setNotices([]);
        setIsLoading(false);
      }
    }, 5000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/notices`);
      const data = await res.json();
      setNotices(Array.isArray(data) ? data : []);
      clearTimeout(timeoutId);
    } catch (err) {
      console.error("API ERROR (fetchNotices):", err);
      setNotices([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Communication Hub</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Institutional Notices</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Broadcasting critical announcements to the university cloud.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#355c7d] text-white px-6 py-3.5 rounded-2xl hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#355c7d]/20 font-bold text-xs uppercase tracking-widest">
           <Megaphone size={18} />
           Draft Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Filters */}
          <div className="flex items-center gap-4 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
            <button className="flex-1 py-2 rounded-xl text-[10px] font-black bg-[#355c7d] text-white uppercase tracking-widest shadow-md shadow-[#355c7d]/20 transition-all">Latest Feed</button>
            <button className="flex-1 py-2 rounded-xl text-[10px] font-black text-gray-400 hover:text-[#355c7d] uppercase tracking-widest transition-all">Pinned Only</button>
            <button className="px-5 py-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"><Filter size={16} className="text-gray-400" /></button>
          </div>

          {/* Notice Feed */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="bg-white p-20 rounded-[32px] border border-gray-100 text-center shadow-sm">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#355c7d]/10 border-t-[#355c7d] rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Bulletin...</p>
                 </div>
              </div>
            ) : (notices?.length || 0) === 0 ? (
              <div className="bg-white p-20 rounded-[32px] border border-gray-100 text-center shadow-sm">
                 <div className="flex flex-col items-center gap-4 opacity-40">
                    <Bell size={48} className="text-gray-300" />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No Active Announcements</p>
                 </div>
              </div>
            ) : (notices || []).map(notice => (
              <div key={notice.id || notice._id} className={`bg-white p-8 rounded-[32px] border-2 transition-all duration-500 relative group overflow-hidden ${notice.important ? 'border-[#355c7d]/20 shadow-xl shadow-[#355c7d]/5' : 'border-gray-50 hover:border-gray-200'}`}>
                {notice.important && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#355c7d]/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
                )}
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                   <div className="flex items-center gap-3">
                      <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ring-1
                        ${notice.category === 'Academic' ? 'bg-blue-50 text-blue-600 ring-blue-500/10' : notice.category === 'Event' ? 'bg-purple-50 text-purple-600 ring-purple-500/10' : 'bg-gray-50 text-gray-600 ring-gray-500/10'}
                      `}>{notice.category}</span>
                      {notice.important && <Star size={16} className="text-[#355c7d] fill-[#355c7d]" />}
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Calendar size={12} /> {notice.date}
                   </div>
                </div>

                <h3 className="text-2xl font-black text-[#2c2c2c] mb-4 tracking-tighter group-hover:text-[#355c7d] transition-colors">{notice.title}</h3>
                <p className="text-gray-500 text-[15px] leading-[1.6] mb-8 font-medium italic group-hover:text-gray-700 transition-colors">{notice.content}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-50 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="flex items-center gap-6">
                      <button className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.2em] hover:brightness-125">MODIFY</button>
                      <button className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] hover:brightness-125">RECALL</button>
                   </div>
                   <button className="p-3 bg-[#355c7d] text-white rounded-xl shadow-lg shadow-[#355c7d]/20 hover:scale-110 active:scale-95 transition-all">
                      <Send size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-10">
           {/* Broadcast Card */}
           <div className="bg-[#355c7d] p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-[#355c7d]/30 group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                 <Bell size={180} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <h4 className="text-[11px] font-black opacity-60 mb-3 uppercase tracking-[0.3em]">PUSH PROTOCOL</h4>
                <p className="text-2xl font-black leading-tight mb-10 italic tracking-tighter">Instantly sync announcements across institutional device cloud.</p>
                <button className="w-full py-5 bg-white text-[#355c7d] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                   DEPLOY NOW <ChevronRight size={16} />
                </button>
              </div>
           </div>
           
           {/* Activity Log */}
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                 <h4 className="text-[11px] font-black text-[#355c7d] uppercase tracking-[0.3em]">ADMIN LOG</h4>
                 <Hash size={18} className="text-gray-200" />
              </div>
              <div className="space-y-8">
                 <div className="flex gap-5 group cursor-default">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#355c7d] mt-2 shrink-0 shadow-[0_0_10px_rgba(53,92,125,0.4)] group-hover:scale-125 transition-transform"></div>
                    <div>
                       <p className="text-[13px] font-black text-[#2c2c2c] tracking-tight group-hover:text-[#355c7d] transition-colors leading-tight">Assessment notice indexed</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">SECURED • 5 MIN AGO</p>
                    </div>
                 </div>
                 <div className="flex gap-5 group cursor-default">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
                    <div>
                       <p className="text-[13px] font-black text-[#2c2c2c] tracking-tight hover:text-rose-500 transition-colors leading-tight">Revoked notice archive</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">VOLATILE • 1 HOUR AGO</p>
                    </div>
                 </div>
              </div>
              <button className="w-full mt-10 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#355c7d] transition-colors text-center">View Master Audit Log</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;
