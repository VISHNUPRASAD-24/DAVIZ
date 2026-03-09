import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentLoginPage = () => {
  const [roll, setRoll] = useState('');
  const navigate = useNavigate();

  const handleEnter = () => {
    if (roll.trim() !== '') {
      localStorage.setItem('daviz_current_student', roll.trim().toUpperCase());
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-400 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[360px] flex flex-col">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Student Login</h2>
        
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] transition-colors"
          />
          
          <button
            onClick={handleEnter}
            className="w-full bg-[#0f3d3e] text-white rounded-md py-3 px-4 hover:bg-[#0b2b2c] transition-all duration-300 font-medium"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
