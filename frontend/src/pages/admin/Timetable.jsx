import React, { useState, useEffect } from 'react';
import { Plus, Clock, User, Book, ChevronRight, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Timetable = () => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [timetable, setTimetable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    subject: '',
    time: '',
    faculty: '',
    department: '',
    semester: 1
  });
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setTimetable([]);
        setIsLoading(false);
      }
    }, 5000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/timetable`);
      const data = await res.json();
      setTimetable(Array.isArray(data) ? data : []);
      clearTimeout(timeoutId);
    } catch (err) {
      console.error("API ERROR (fetchTimetable):", err);
      setTimetable([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ day: 'Monday', subject: '', time: '', faculty: '', department: '', semester: 1 });
        fetchTimetable();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("API ERROR (handleAddEntry):", err);
    }
  };

  const dayData = Array.isArray(timetable) ? timetable.filter(item => item.day === activeDay) : [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Schedule Management</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Academic Timetable</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Structured weekly lecture & laboratory scheduling system.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#355c7d] text-white px-6 py-3.5 rounded-2xl hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#355c7d]/20 font-bold text-xs uppercase tracking-widest"
        >
          <Plus size={18} />
          Create Entry
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide py-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-10 py-3.5 rounded-full text-[11px] font-black transition-all border-2 uppercase tracking-[0.2em] whitespace-nowrap
              ${activeDay === day 
                ? 'bg-[#355c7d] border-[#355c7d] text-white shadow-xl shadow-[#355c7d]/20 scale-105' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-[#355c7d]/30 hover:text-[#355c7d]'}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Slots */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="bg-white p-20 rounded-[32px] border border-gray-100 text-center shadow-sm">
             <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#355c7d]/10 border-t-[#355c7d] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Schedule Cloud...</p>
             </div>
          </div>
        ) : (dayData?.length || 0) === 0 ? (
          <div className="bg-white p-20 rounded-[32px] border border-gray-100 text-center shadow-sm">
             <div className="flex flex-col items-center gap-4 opacity-40">
                <Calendar size={48} className="text-gray-300" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Zero sessions scheduled for {activeDay}</p>
             </div>
          </div>
        ) : (
          (dayData || []).map(item => (
            <div key={item._id} className="bg-white p-8 rounded-[28px] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 border-l-8 border-l-[#355c7d]/10 hover:border-l-[#355c7d]">
              <div className="flex items-center gap-8">
                <div className="bg-gray-50 p-5 rounded-2xl text-gray-300 group-hover:bg-[#355c7d]/5 group-hover:text-[#355c7d] transition-all duration-500">
                   <Clock size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em] mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">{item.time}</p>
                  <h3 className="text-2xl font-black text-[#2c2c2c] tracking-tighter group-hover:text-[#355c7d] transition-colors">{item.subject}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-10 items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                      <User size={20} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Lead Faculty</span>
                      <span className="text-[15px] font-black text-[#2c2c2c] tracking-tight">{item.faculty}</span>
                   </div>
                </div>
                <div className="flex items-center gap-4 border-l border-gray-100 pl-10">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                      <Book size={20} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Division</span>
                      <span className="text-[15px] font-black text-[#355c7d] uppercase tracking-tighter">{item.department}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="p-3 bg-gray-50 text-gray-400 hover:bg-[#355c7d] hover:text-white rounded-xl transition-all shadow-sm group-hover:scale-110">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - Modernized */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/20">
            <div className="bg-[#355c7d] p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">NEW SCHEDULE SLOT</h2>
              <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mt-2">Update institutional timeline</p>
            </div>
            <form onSubmit={handleAddEntry} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Target Day</label>
                  <select 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Interval / Time</label>
                  <input 
                    required type="text" placeholder="e.g. 09:00 AM"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Academic Subject</label>
                  <input 
                    required type="text" placeholder="Enter course name..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Faculty In-charge</label>
                  <input 
                    required type="text" placeholder="e.g. Dr. Richards"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.faculty}
                    onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Dept / Cluster</label>
                  <input 
                    required type="text" placeholder="e.g. AIML"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 border border-gray-100 text-gray-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 rounded-[20px] transition-all">Discard</button>
                <button type="submit" className="flex-[2] px-10 py-5 bg-[#355c7d] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[20px] shadow-2xl shadow-[#355c7d]/30 hover:brightness-110 active:scale-95 transition-all">Publish Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
