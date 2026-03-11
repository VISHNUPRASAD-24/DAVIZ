import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  Upload,
  MoreVertical, 
  Mail, 
  Phone, 
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
  User
} from 'lucide-react';

import { API_BASE_URL } from '../../config/api';

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    regNo: '',
    name: '',
    department: '',
    year: '',
    semester: '1',
    section: 'A',
    email: '',
    phone: '',
    community: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, currentPage]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/students?search=${searchTerm}&page=${currentPage}&limit=8`);
      const data = await res.json();
      if (data?.success) {
        setStudents(Array.isArray(data.students) ? data.students : []);
        setTotalPages(data.totalPages || 1);
        setTotalStudents(data.total || 0);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("API ERROR (fetchStudents):", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (regNo) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${regNo}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchStudents();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("API ERROR (deleteStudent):", err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ regNo: '', name: '', department: '', year: '', semester: '1', section: 'A', email: '', phone: '', community: '' });
        fetchStudents();
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (err) {
      console.error("API ERROR (handleAddStudent):", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Records Management</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Student Directory</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Managing {totalStudents || 0} active enrollment profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/import')}
            className="flex items-center justify-center gap-2 bg-white text-[#355c7d] border border-gray-200 px-6 py-3.5 rounded-2xl hover:bg-gray-50 hover:border-[#355c7d]/30 transition-all shadow-sm font-bold text-xs uppercase tracking-widest"
          >
            <Upload size={18} />
            Bulk Import
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#355c7d] text-white px-6 py-3.5 rounded-2xl hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#355c7d]/20 font-bold text-xs uppercase tracking-widest"
          >
            <UserPlus size={18} />
            Enroll Student
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-6 items-center justify-between bg-gray-50/50">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by profile or register ID..."
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-[18px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 text-[#2c2c2c] bg-white rounded-[16px] border border-gray-200 hover:bg-gray-50 hover:border-[#355c7d]/20 transition-all text-xs font-black uppercase tracking-widest group">
              <Filter size={18} className="text-gray-400 group-hover:text-[#355c7d] transition-colors" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
                <th className="px-8 py-5">Profile Information</th>
                <th className="px-8 py-5">Register ID</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5">Academic Level</th>
                <th className="px-8 py-5">Communication</th>
                <th className="px-8 py-5 text-center">System Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                   <td colSpan="6" className="px-8 py-20 text-center">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#355c7d]/10 border-t-[#355c7d] rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Querying Directory...</p>
                     </div>
                   </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                   <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                         <User size={48} className="text-gray-300" />
                         <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No student records available</p>
                      </div>
                   </td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={student._id} className="hover:bg-gray-50/80 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#355c7d]/10 to-[#355c7d]/5 flex items-center justify-center text-[#355c7d] font-black text-lg shadow-inner group-hover:scale-110 transition-transform duration-500">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-[#2c2c2c] text-[15px] tracking-tight group-hover:text-[#355c7d] transition-colors">{student.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{student.community || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-mono text-gray-600 font-bold tracking-tight">
                      {student.regNo}
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex px-3.5 py-1.5 rounded-xl bg-[#355c7d]/5 text-[#355c7d] text-[11px] font-black uppercase tracking-widest">
                        {student.department}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-[#2c2c2c] font-black tracking-tight">Year {student.year}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mt-0.5">Section {student.section}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold">
                          <Phone size={14} className="text-gray-300" /> {student.phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold">
                          <Mail size={14} className="text-gray-300" /> {student.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          className="p-2.5 bg-gray-50 hover:bg-[#355c7d] rounded-xl text-gray-400 hover:text-white transition-all shadow-sm"
                          title="View Details"
                        >
                          <MoreVertical size={18} />
                        </button>
                        <button 
                          onClick={() => deleteStudent(student.regNo)}
                          className="p-2.5 bg-rose-50 hover:bg-rose-500 rounded-xl text-rose-400 hover:text-white transition-all shadow-sm"
                          title="Remove Profile"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
           <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">
             Page {currentPage} of {totalPages} <span className="mx-2 opacity-50">•</span> {totalStudents} Records Found
           </p>
           <div className="flex gap-3">
             <button 
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[#355c7d]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
             >
               <ChevronLeft size={20} className="text-[#355c7d]" />
             </button>
             <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages}
               className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[#355c7d]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
             >
               <ChevronRight size={20} className="text-[#355c7d]" />
             </button>
           </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/20">
            <div className="bg-[#355c7d] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h2 className="text-3xl font-black italic tracking-tighter">ENROLL STUDENT</h2>
              <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mt-2">Create new academic profile</p>
            </div>
            <form onSubmit={handleAddStudent} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Legal Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold placeholder:text-gray-300"
                    placeholder="Enter student's full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Institutional Register ID</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold placeholder:text-gray-300"
                    placeholder="e.g. 211421..."
                    value={formData.regNo}
                    onChange={(e) => setFormData({...formData, regNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Academic Department</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold placeholder:text-gray-300"
                    placeholder="e.g. AIML / CSE"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Academic Year</label>
                  <select 
                    required 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Section Cluster</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Contact Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    placeholder="student@daviz.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Primary Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    placeholder="91XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Student Community</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                    placeholder="e.g. BC / MBC / OC"
                    value={formData.community}
                    onChange={(e) => setFormData({...formData, community: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-5 border border-gray-100 text-gray-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 rounded-[20px] transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-10 py-5 bg-[#355c7d] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[20px] shadow-2xl shadow-[#355c7d]/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  Initialize Records
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
