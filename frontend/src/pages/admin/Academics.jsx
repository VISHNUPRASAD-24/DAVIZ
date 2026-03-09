import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, GraduationCap, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Academics = () => {
  const [students, setStudents] = useState([]);
  const [academicRecords, setAcademicRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentRoll, setSelectedStudentRoll] = useState(null);
  
  const [formData, setFormData] = useState({
    roll: '',
    semester: '',
    subject: '',
    cycleTest1: '',
    cycleTest2: '',
    internal1: '',
    internal2: '',
    modelExam: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, academicsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students?limit=1000`),
        fetch(`${API_BASE_URL}/api/academics`)
      ]);
      const studentsData = await studentsRes.json();
      const academicsData = await academicsRes.json();
      
      setStudents(Array.isArray(studentsData?.students) ? studentsData.students : []);
      setAcademicRecords(Array.isArray(academicsData) ? academicsData : []);
    } catch (err) {
      console.error("API ERROR (fetchData Academics):", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/academics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({
          roll: '', semester: '', subject: '',
          cycleTest1: '', cycleTest2: '',
          internal1: '', internal2: '', modelExam: ''
        });
        fetchData();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("API ERROR (handleAddRecord):", err);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this subject record?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/academics/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error("API ERROR (deleteRecord):", err);
    }
  };

  const getRecordCount = (roll) => {
    return academicRecords.filter(r => r.roll === roll).length;
  };

  const filteredStudents = (students || []).filter(s => 
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.roll || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Internal Assessments</h1>
          <p className="text-gray-500 text-sm">Anna University Assessment Tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search student..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#0f3d3e] text-white px-4 py-2 rounded-xl hover:bg-[#0b2b2c] transition-all font-semibold text-sm shadow-sm"
          >
            <Plus size={18} /> Add Marks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Total Subjects Recorded</p>
            <p className="text-xl font-bold text-gray-800">{academicRecords.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><GraduationCap size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Active Semesters</p>
            <p className="text-xl font-bold text-gray-800">
              {[...new Set(academicRecords.map(r => r.semester))].length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4 text-center">Subjects Entered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading assessments...</td></tr>
              ) : filteredStudents.map(student => (
                <React.Fragment key={student._id}>
                  <tr 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedStudentRoll(selectedStudentRoll === student.roll ? null : student.roll)}
                  >
                    <td className="px-6 py-4">
                      {selectedStudentRoll === student.roll ? <ChevronDown size={18}/> : <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500"/>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{student.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-600">{student.roll}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-[#0f3d3e]/10 text-[#0f3d3e] px-3 py-1 rounded-full text-xs font-bold">
                        {getRecordCount(student.roll)} Subjects
                      </span>
                    </td>
                  </tr>
                  {selectedStudentRoll === student.roll && (
                    <tr className="bg-gray-50/30">
                      <td colSpan="4" className="px-12 py-6">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-tight">
                              <tr>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3 text-center">Sem</th>
                                <th className="px-4 py-3 text-center">Cycle 1</th>
                                <th className="px-4 py-3 text-center">Cycle 2</th>
                                <th className="px-4 py-3 text-center">Internal 1</th>
                                <th className="px-4 py-3 text-center">Internal 2</th>
                                <th className="px-4 py-3 text-center">Model</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {academicRecords.filter(r => r.roll === student.roll).length === 0 ? (
                                <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400 italic">No records found for this student.</td></tr>
                              ) : academicRecords.filter(r => r.roll === student.roll).map(record => (
                                <tr key={record._id} className="hover:bg-gray-50/50">
                                  <td className="px-4 py-3 font-bold text-gray-700">{record.subject}</td>
                                  <td className="px-4 py-3 text-center text-gray-500">{record.semester}</td>
                                  <td className="px-4 py-3 text-center font-medium">{record.cycleTest1}</td>
                                  <td className="px-4 py-3 text-center font-medium">{record.cycleTest2}</td>
                                  <td className="px-4 py-3 text-center text-blue-600 font-bold">{record.internal1}</td>
                                  <td className="px-4 py-3 text-center text-blue-600 font-bold">{record.internal2}</td>
                                  <td className="px-4 py-3 text-center text-emerald-600 font-black">{record.modelExam}</td>
                                  <td className="px-4 py-3 text-center">
                                    <button onClick={() => deleteRecord(record._id)} className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                      <Trash2 size={14}/>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0f3d3e] p-8 text-white relative">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Enter Academic Marks</h2>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Anna University Assessment Portal</p>
            </div>
            <form onSubmit={handleAddRecord} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Student Roll Number</label>
                   <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 text-sm font-bold"
                     placeholder="e.g. 22AIML002" value={formData.roll}
                     onChange={(e) => setFormData({...formData, roll: e.target.value.toUpperCase()})}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Semester</label>
                   <input required type="number" min="1" max="8" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 text-sm font-bold"
                     placeholder="e.g. 3" value={formData.semester}
                     onChange={(e) => setFormData({...formData, semester: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Subject Name</label>
                   <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 text-sm font-bold"
                     placeholder="e.g. Mathematics" value={formData.subject}
                     onChange={(e) => setFormData({...formData, subject: e.target.value})}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-3 col-span-2">
                   <div>
                     <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Cycle 1</label>
                     <input type="number" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                       value={formData.cycleTest1} onChange={(e) => setFormData({...formData, cycleTest1: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Cycle 2</label>
                     <input type="number" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                       value={formData.cycleTest2} onChange={(e) => setFormData({...formData, cycleTest2: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Internal 1</label>
                     <input type="number" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                       value={formData.internal1} onChange={(e) => setFormData({...formData, internal1: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Internal 2</label>
                     <input type="number" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                       value={formData.internal2} onChange={(e) => setFormData({...formData, internal2: e.target.value})} />
                   </div>
                   <div className="col-span-2">
                     <label className="block text-[9px] font-black text-[#0f3d3e] uppercase mb-1">Model Exam</label>
                     <input type="number" className="w-full px-3 py-3 bg-[#0f3d3e]/5 border border-[#0f3d3e]/10 rounded-lg text-sm font-black text-[#0f3d3e]"
                       value={formData.modelExam} onChange={(e) => setFormData({...formData, modelExam: e.target.value})} />
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-100 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#fbbf24] text-[#0f3d3e] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#f59e0b] shadow-lg shadow-yellow-400/20 transition-all transform active:scale-95">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;
