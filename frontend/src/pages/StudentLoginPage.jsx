import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';

const StudentLoginPage = () => {
  const [roll, setRoll] = useState('');
  const navigate = useNavigate();

  const handleEnter = (e) => {
    e.preventDefault();
    if (roll.trim() !== '') {
      localStorage.setItem('daviz_current_student', roll.trim().toUpperCase());
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#d1d5db] p-4 font-sans">
      <div className="bg-white rounded-[18px] shadow-2xl p-10 w-full max-w-[420px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#355c7d]/10 p-4 rounded-full text-[#355c7d] mb-4">
            <User size={40} />
          </div>
          <h2 className="text-3xl font-bold text-[#355c7d]">Student Login</h2>
          <p className="text-gray-500 mt-2">Access your academic records</p>
        </div>
        
        <form onSubmit={handleEnter} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Register Number</label>
            <input
              type="text"
              placeholder="e.g. 211421104001"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#355c7d] focus:ring-1 focus:ring-[#355c7d] transition-all bg-gray-50/50"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#355c7d] text-white rounded-xl py-4 px-6 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#355c7d]/20"
          >
            Enter Portal <ArrowRight size={20} />
          </button>
        </form>

        <button 
          onClick={() => navigate('/')}
          className="mt-8 text-gray-400 hover:text-[#355c7d] text-sm font-medium transition-colors"
        >
          ← Back to selection
        </button>
      </div>
    </div>
  );
};

export default StudentLoginPage;
