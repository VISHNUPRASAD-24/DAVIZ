import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Clock, MapPin, ChevronRight, Hash } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    time: '',
    hall: '',
    department: '',
    semester: 1,
    type: 'Semester'
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setExams([]);
        setIsLoading(false);
      }
    }, 5000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/exams`);
      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
      clearTimeout(timeoutId);
    } catch (err) {
      console.error("API ERROR (fetchExams):", err);
      setExams([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ subject: '', date: '', time: '', hall: '', department: '', semester: 1, type: 'Semester' });
        fetchExams();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("API ERROR (handleAddExam):", err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Institutional Exams</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Examination Schedule</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Managing global assessment timelines and hall allocations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#355c7d] text-white px-6 py-3.5 rounded-2xl hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#355c7d]/20 font-bold text-xs uppercase tracking-widest"
        >
          <Plus size={18} />
          Schedule Exam
        </button>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          <div className="lg:col-span-2 bg-white p-20 rounded-[32px] border border-gray-100 text-center shadow-sm">
             <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#355c7d]/10 border-t-[#355c7d] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching Exam Registry...</p>
             </div>
          </div>
        ) : (exams?.length || 0) === 0 ? (
          <div className="lg:col-span-2 bg-white p-20 rounded-[32px] border border-gray-100 text-center shadow-sm">
             <div className="flex flex-col items-center gap-4 opacity-40">
                <FileText size={48} className="text-gray-300" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No Examinations found in database</p>
             </div>
          </div>
        ) : (
          (exams || []).map((exam, index) => (
            <div key={exam._id || index} className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-xl hover:translate-y-[-6px] transition-all duration-500 relative overflow-hidden border-t-8 border-t-[#355c7d]">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                  <FileText size={120} strokeWidth={1} />
               </div>
               
               <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm ${exam.type === 'Practical' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/10' : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10'}`}>
                      {exam.type || 'Semester'}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dept: {exam.department} • SEM {exam.semester}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl text-[#355c7d] group-hover:bg-[#355c7d] group-hover:text-white transition-all duration-500">
                     <Hash size={20} />
                  </div>
               </div>

               <h2 className="text-2xl font-black text-[#2c2c2c] mb-6 tracking-tighter group-hover:text-[#355c7d] transition-colors">{exam.subject}</h2>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-transparent group-hover:border-gray-100 transition-all">
                    <Calendar size={18} className="text-[#355c7d]" />
                    <span className="text-xs font-black text-[#2c2c2c]">{new Date(exam.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-transparent group-hover:border-gray-100 transition-all">
                    <Clock size={18} className="text-[#355c7d]" />
                    <span className="text-xs font-black text-[#2c2c2c]">{exam.time}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-transparent group-hover:border-gray-100 transition-all">
                    <MapPin size={18} className="text-rose-500" />
                    <span className="text-xs font-black text-[#2c2c2c] italic">{exam.hall || 'Venue TBD'}</span>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4">
                  <button className="flex-1 py-4 text-[10px] font-black italic tracking-[0.2em] uppercase text-white bg-[#355c7d] rounded-2xl hover:brightness-110 shadow-lg shadow-[#355c7d]/20 transition-all active:scale-95">REVISE</button>
                  <button className="flex-1 py-4 text-[10px] font-black italic tracking-[0.2em] uppercase text-gray-400 border border-gray-100 rounded-2xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95">ABORT</button>
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
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">SCHEDULE ASSESSMENT</h2>
              <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mt-2">Create new examination entry</p>
            </div>
            <form onSubmit={handleAddExam} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Assessment Title / Subject</label>
                  <input 
                    required type="text" placeholder="e.g. Advanced AI & ML"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Exam Date</label>
                  <input 
                    required type="date"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Slot Time</label>
                  <input 
                    required type="text" placeholder="09:30 AM"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Venue / Hall</label>
                  <input 
                    required type="text" placeholder="Hall 12B"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.hall}
                    onChange={(e) => setFormData({...formData, hall: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Exam Category</label>
                  <select 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Semester">Semester End</option>
                    <option value="Internal">Internal Assessment</option>
                    <option value="Practical">Practical / Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Department</label>
                  <input 
                    required type="text" placeholder="AIML"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Semester</label>
                  <input 
                    required type="number"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 border border-gray-100 text-gray-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 rounded-[20px] transition-all">Cancel</button>
                <button type="submit" className="flex-[2] px-10 py-5 bg-[#355c7d] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[20px] shadow-2xl shadow-[#355c7d]/30 hover:brightness-110 active:scale-95 transition-all">Sync Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
