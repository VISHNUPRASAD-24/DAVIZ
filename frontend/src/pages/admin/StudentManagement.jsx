import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Hash,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

import { API_BASE_URL } from '../../config/api';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    roll: '',
    name: '',
    department: '',
    year: '',
    semester: '1',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, currentPage]);

  const fetchStudents = async () => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("Student fetch timed out.");
        setStudents([]);
        setIsLoading(false);
      }
    }, 5000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/students?search=${searchTerm}&page=${currentPage}&limit=8`);
      const data = await res.json();
      if (data?.success) {
        setStudents(Array.isArray(data.students) ? data.students : []);
        setTotalPages(data.totalPages || 1);
        setTotalStudents(data.total || 0);
        clearTimeout(timeoutId);
      } else {
        console.error("API error fetching students:", data?.message);
        setStudents([]);
      }
    } catch (err) {
      console.error("API ERROR (fetchStudents):", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (roll) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${roll}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchStudents();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("API ERROR (deleteStudent):", err);
      alert("Failed to delete student. Check console for details.");
    }
  };
  const handleAddStudent = async (e) => {
    e.preventDefault();
    console.log("Submitting student data:", formData);
    try {
      const res = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log("Add student response:", data);
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ roll: '', name: '', department: '', year: '', semester: '1', email: '', phone: '' });
        fetchStudents();
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (err) {
      console.error("API ERROR (handleAddStudent):", err);
      alert("Failed to add student.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
          <p className="text-gray-500 text-sm">Efficiently manage {totalStudents || 0} student records</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-xl hover:bg-[#0b2b2c] transition-all shadow-md shadow-[#0f3d3e]/10"
        >
          <UserPlus size={18} />
          <span className="font-semibold text-sm">Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or roll number..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/20 focus:border-[#0f3d3e] transition-all text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Year/Sem</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                   <td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading records...</td>
                </tr>
              ) : (students?.length || 0) === 0 ? (
                <tr>
                   <td colSpan="6" className="px-6 py-10 text-center text-gray-400">No students found.</td>
                </tr>
              ) : (
                (students || []).map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f3d3e]/10 flex items-center justify-center text-[#0f3d3e] font-bold text-sm">
                          {(student?.name || "S").charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{student?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{student?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-600 font-medium">{student?.roll || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                        {student?.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 font-medium">Year {student?.year || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Sem {student?.semester || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone size={12} /> {student.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0f3d3e] transition-colors"
                          title="Edit Profile"
                        >
                          <MoreVertical size={18} />
                        </button>
                        <button 
                          onClick={() => deleteStudent(student.roll)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Student"
                        >
                          <Hash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
           <p className="text-xs text-gray-500 font-medium">
             Showing {students?.length || 0} of {totalStudents || 0} students
           </p>
           <div className="flex gap-2">
             <button 
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
               <ChevronLeft size={18} />
             </button>
             <div className="flex items-center px-4 text-xs font-bold text-gray-600">
               Page {currentPage} of {totalPages}
             </div>
             <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages}
               className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
               <ChevronRight size={18} />
             </button>
           </div>
        </div>
      </div>
      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#0f3d3e] p-6 text-white text-center">
              <h2 className="text-xl font-bold uppercase tracking-widest">Add New Student</h2>
              <p className="text-white/60 text-xs mt-1">Institutional Enrollment Portal</p>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 focus:border-[#0f3d3e] transition-all text-sm font-medium"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Roll Number</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 focus:border-[#0f3d3e] transition-all text-sm font-medium"
                    placeholder="e.g. 21AIML01"
                    value={formData.roll}
                    onChange={(e) => setFormData({...formData, roll: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Department</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 focus:border-[#0f3d3e] transition-all text-sm font-medium"
                    placeholder="e.g. AIML"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Year</label>
                  <input 
                    required 
                    type="number" 
                    min="1" max="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 focus:border-[#0f3d3e] transition-all text-sm font-medium"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Semester</label>
                  <input 
                    required 
                    type="number" 
                    min="1" max="8"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/10 focus:border-[#0f3d3e] transition-all text-sm font-medium"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-100 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-2 px-8 py-3 bg-[#fbbf24] text-[#0f3d3e] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#f59e0b] shadow-lg shadow-yellow-400/20 transition-all"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
