import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    roll: '',
    name: '',
    department: '',
    year: '',
    attendance: '',
    internalMarks: '',
    cgpa: ''
  });

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Could not load student data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Basic format parsing
    const newStudent = {
      ...formData,
      year: parseInt(formData.year),
      attendance: parseFloat(formData.attendance),
      internalMarks: parseFloat(formData.internalMarks),
      cgpa: parseFloat(formData.cgpa)
    };

    try {
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add student');
      }

      setStatus({ type: 'success', message: 'Student added successfully!' });
      setFormData({
        roll: '', name: '', department: '', year: '', attendance: '', internalMarks: '', cgpa: ''
      });
      
      // Refresh the list immediately
      fetchStudents();

      // Clear success message after 3 seconds
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);

    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 shrink-0 flex items-center justify-between px-6 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#0f3d3e] p-2 rounded-lg">
            <Users size={20} className="text-yellow-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium text-sm px-3 py-2 rounded-md hover:bg-red-50 focus:outline-none"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 p-6 md:p-10 flex justify-center overflow-y-auto">
        <div className="w-full max-w-5xl space-y-8">
          
          {/* Status Alerts */}
          {status.message && (
            <div className={`p-4 rounded-md flex items-center gap-3 shadow-sm ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium text-sm">{status.message}</span>
            </div>
          )}

          {/* Add Student Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Add New Student</h2>
              <p className="text-sm text-gray-500 mt-1">Enter academic details below to append to the database.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input required type="text" name="roll" value={formData.roll} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]" placeholder="e.g. 21AIML01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]" placeholder="Student Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input required type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]" placeholder="e.g. AIML" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input required type="number" min="1" max="4" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]" placeholder="1-4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
                  <input required type="number" step="0.1" name="attendance" value={formData.attendance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]" placeholder="0 - 100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Marks</label>
                  <input required type="number" step="0.1" name="internalMarks" value={formData.internalMarks} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]" placeholder="Score" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                  <input required type="number" step="0.01" max="10" name="cgpa" value={formData.cgpa} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]" placeholder="Scale 10.0" />
                </div>
                
                <div className="lg:col-span-3 flex justify-end mt-2">
                  <button type="submit" className="bg-[#0f3d3e] text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-[#0b2b2c] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] focus:ring-offset-2">
                    Submit Record
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Student Table Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Student Directory</h2>
                <p className="text-sm text-gray-500 mt-1">List of all students currently in the database.</p>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 border border-gray-200 rounded-full shadow-sm">
                Total: {students.length}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Roll</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dept</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marks</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CGPA</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-6 h-6 border-2 border-[#0f3d3e] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-500 font-medium">Loading records...</p>
                        </div>
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student._id || student.roll} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.roll}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className={`px-2 inline-flex leading-5 font-semibold rounded-full ${student.attendance >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.internalMarks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0f3d3e]">{student.cgpa}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                        No students found in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
