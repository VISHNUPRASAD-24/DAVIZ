import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Bell, Megaphone, Send, Trash2, Filter, Star } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notice Board</h1>
          <p className="text-gray-500 text-sm">Publish and manage university-wide announcements</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0f3d3e] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#0f3d3e]/20 hover:scale-[1.02] transition-transform">
           <Megaphone size={18} />
           Create New Notice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 italic">
            <button className="flex-1 py-1.5 rounded-lg text-xs font-black bg-gray-50 text-gray-800 uppercase tracking-widest">Recent All</button>
            <button className="flex-1 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">Important Only</button>
            <button className="px-4 py-1.5 rounded-lg border border-gray-100"><Filter size={14} className="text-gray-400" /></button>
          </div>

          <div className="space-y-4 italic">
            {isLoading ? (
              <div className="p-10 text-center text-gray-400 font-bold">Loading notices...</div>
            ) : (notices?.length || 0) === 0 ? (
              <div className="p-10 text-center text-gray-400 font-bold">No active notices found.</div>
            ) : (notices || []).map(notice => (
              <div key={notice.id || notice._id} className={`bg-white p-6 rounded-2xl border-2 transition-all group ${notice.important ? 'border-yellow-400 shadow-lg shadow-yellow-400/5' : 'border-gray-50 hover:border-gray-100'}`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                        ${notice.category === 'Academic' ? 'bg-blue-50 text-blue-600' : notice.category === 'Event' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}
                      `}>{notice.category}</span>
                      {notice.important && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase">{notice.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{notice.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{notice.content}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-4">
                      <button className="text-[10px] font-black text-[#0f3d3e] hover:underline">EDIT NOTICE</button>
                      <button className="text-[10px] font-black text-red-500 hover:underline">DELETE</button>
                   </div>
                   <button className="p-2 bg-gray-50 rounded-lg text-gray-400"><Send size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#0f3d3e] p-8 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Bell size={120} />
              </div>
              <h4 className="text-sm font-bold opacity-70 mb-2 uppercase tracking-widest text-[#fbbf24]">Push to App</h4>
              <p className="text-xl font-bold leading-tight mb-8 italic">Instantly reach all student mobile devices with push notifications.</p>
              <button className="w-full py-4 bg-[#fbbf24] text-[#0f3d3e] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors">Broadcast Now</button>
           </div>
           
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Activity Log</h4>
              <div className="space-y-6 italic">
                 <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    <div>
                       <p className="text-xs font-bold text-gray-800">New exam notice added</p>
                       <p className="text-[10px] text-gray-400">by Admin • 5m ago</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                    <div>
                       <p className="text-xs font-bold text-gray-800">Notice deleted (Holiday)</p>
                       <p className="text-[10px] text-gray-400">by Admin • 1h ago</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;
