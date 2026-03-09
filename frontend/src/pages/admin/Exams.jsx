import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Clock, MapPin } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Examination Schedule</h1>
          <p className="text-gray-500 text-sm">Organize and monitor semester exam timelines</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-xl hover:bg-[#0b2b2c] transition-all shadow-md shadow-[#0f3d3e]/10"
        >
          <Plus size={18} />
          <span className="font-semibold text-sm">Add Exam</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#0f3d3e] p-6 text-white text-center">
              <h2 className="text-xl font-bold uppercase tracking-widest">Schedule New Exam</h2>
            </div>
            <form onSubmit={handleAddExam} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                  <input 
                    required type="date"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Time</label>
                  <input 
                    required type="text" placeholder="09:00 AM"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hall</label>
                  <input 
                    required type="text" placeholder="Hall A-1"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.hall}
                    onChange={(e) => setFormData({...formData, hall: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Type</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Semester">Semester</option>
                    <option value="Internal">Internal</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Department</label>
                  <input 
                    required type="text" placeholder="CS"
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
                <button type="submit" className="flex-1 py-2 bg-[#fbbf24] text-[#0f3d3e] font-bold text-xs uppercase rounded-xl">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center py-10 text-gray-400">Loading exams...</div>
        ) : (exams?.length || 0) === 0 ? (
          <div className="col-span-2 text-center py-10 text-gray-400">No exams scheduled.</div>
        ) : (
          (exams || []).map((exam, index) => (
            <div key={exam._id || index} className="bg-white p-6 rounded-2xl border-l-[6px] border-[#0f3d3e] shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${exam.type === 'Practical' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {exam.type || 'Semester'}
                  </span>
                  <FileText className="text-gray-100" size={40} strokeWidth={1} />
               </div>
               <h2 className="text-xl font-bold text-gray-800 mb-4">{exam.subject}</h2>
               
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <Calendar size={16} className="text-[#fbbf24]" />
                    <span>{new Date(exam.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock size={16} className="text-[#fbbf24]" />
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-[#fbbf24]" />
                    <span className="italic">{exam.hall}</span>
                  </div>
               </div>
               <div className="mt-6 flex gap-2">
                  <button className="flex-1 py-3 text-[10px] font-bold text-[#0f3d3e] bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-colors tracking-widest uppercase">Manage</button>
                  <button className="flex-1 py-3 text-[10px] font-bold text-gray-400 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors tracking-widest uppercase">Cancel</button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Exams;
