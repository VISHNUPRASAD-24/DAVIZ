import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setStudents([]);
        setAttendanceRecords([]);
        setIsLoading(false);
      }
    }, 5000);

    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students?limit=1000`),
        fetch(`${API_BASE_URL}/api/attendance`)
      ]);
      const studentsData = await studentsRes.json();
      const attendanceData = await attendanceRes.json();
      
      setStudents(Array.isArray(studentsData?.students) ? studentsData.students : []);
      setAttendanceRecords(Array.isArray(attendanceData) ? attendanceData : []);
      clearTimeout(timeoutId);
    } catch (err) {
      console.error("API ERROR (fetchData Attendance):", err);
      setStudents([]);
      setAttendanceRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAttendance = async (roll, status) => {
    console.log(`Marking ${roll} as ${status}`);
    try {
      const res = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roll,
          subject: selectedSubject,
          date: selectedDate,
          status
        })
      });
      const data = await res.json();
      console.log("Mark attendance response:", data);
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error("API ERROR (markAttendance):", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
          <p className="text-gray-500 text-sm">Track and monitor student attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/20"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Computer Science</option>
              </select>
              <input 
                type="date"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/20"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan="3" className="px-4 py-10 text-center text-gray-400">Loading students...</td></tr>
                ) : (students || []).map((student) => {
                  const record = (attendanceRecords || []).find(r => 
                    r.roll === student.roll && 
                    new Date(r.date).toISOString().split('T')[0] === selectedDate &&
                    r.subject === selectedSubject
                  );

                  return (
                    <tr key={student.roll} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-700">{student.name}</td>
                      <td className="px-4 py-4 text-gray-500 font-mono text-sm">{student.roll}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => markAttendance(student.roll, 'Present')}
                            className={`p-2 rounded-lg transition-all ${record?.status === 'Present' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:text-green-500'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          </button>
                          <button 
                            onClick={() => markAttendance(student.roll, 'Absent')}
                            className={`p-2 rounded-lg transition-all ${record?.status === 'Absent' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400 hover:text-red-500'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Attendance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                <span className="text-green-700 font-medium">Present Today</span>
                <span className="text-2xl font-bold text-green-700">
                  {(attendanceRecords || []).filter(r => new Date(r.date).toISOString().split('T')[0] === selectedDate && r.status === 'Present' && r.subject === selectedSubject).length}
                </span>
              </div>
              <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
                <span className="text-red-700 font-medium">Absent Today</span>
                <span className="text-2xl font-bold text-red-700">
                  {(attendanceRecords || []).filter(r => new Date(r.date).toISOString().split('T')[0] === selectedDate && r.status === 'Absent' && r.subject === selectedSubject).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
