import React, { useState, useEffect } from 'react';
import { Plus, Clock, User, Book } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Academic Timetable</h1>
          <p className="text-gray-500 text-sm">Schedule and manage weekly classes across departments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-xl hover:bg-[#0b2b2c] transition-all shadow-md shadow-[#0f3d3e]/10"
        >
          <Plus size={18} />
          <span className="font-semibold text-sm">New Entry</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#0f3d3e] p-6 text-white text-center">
              <h2 className="text-xl font-bold uppercase tracking-widest">Add Timetable Entry</h2>
            </div>
            <form onSubmit={handleAddEntry} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Day</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Time</label>
                  <input 
                    required type="text" placeholder="e.g. 09:00 AM"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subject</label>
                  <input 
                    required type="text" placeholder="e.g. Mathematics"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Faculty</label>
                  <input 
                    required type="text" placeholder="e.g. Dr. Smith"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.faculty}
                    onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Department</label>
                  <input 
                    required type="text" placeholder="e.g. CS"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Semester</label>
                  <input 
                    required type="number"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-gray-400 font-bold text-xs uppercase border rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#fbbf24] text-[#0f3d3e] font-bold text-xs uppercase rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all border-2 uppercase tracking-widest
              ${activeDay === day 
                ? 'bg-[#fbbf24] border-[#fbbf24] text-[#0f3d3e] shadow-lg shadow-yellow-400/20' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-400">Loading timetable...</div>
        ) : (dayData?.length || 0) === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-400">No classes scheduled for {activeDay}.</div>
        ) : (
          (dayData || []).map(item => (
            <div key={item._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#fbbf24] transition-all">
              <div className="flex items-center gap-6">
                <div className="bg-gray-50 p-4 rounded-xl text-gray-300 group-hover:text-[#fbbf24] transition-colors">
                   <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{item.time}</p>
                  <h3 className="text-lg font-bold text-gray-800 tracking-tight">{item.subject}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <User size={14} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Faculty</span>
                      <span className="text-sm font-bold text-gray-700">{item.faculty}</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 border-l border-gray-100 pl-8">
                   <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Book size={14} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Department</span>
                      <span className="text-sm font-bold text-[#0f3d3e] uppercase">{item.department}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 text-[10px] font-black text-[#0f3d3e] hover:bg-yellow-400 rounded-lg transition-all uppercase tracking-widest">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timetable;
