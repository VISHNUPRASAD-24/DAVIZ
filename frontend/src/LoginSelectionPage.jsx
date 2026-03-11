import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

const LoginSelectionPage = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null); // 'student' or 'admin'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#d1d5db] p-4 font-sans">
      {/* Centered Title */}
      <h1 className="text-4xl md:text-5xl font-black text-[#355c7d] mb-12 tracking-tight text-center">
        DAVIZ AI Assistant
      </h1>

      {/* Centered Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-[20px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[480px]">
        
        {/* Student Panel - Left */}
        <div 
          onMouseEnter={() => setHovered('student')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => navigate('/student-login')}
          className={`relative flex-1 flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-[400ms] ease-in-out bg-white ${
            hovered === 'student' ? 'md:grow-[1.2] brightness-[0.98]' : hovered === 'admin' ? 'md:grow-[0.8] opacity-80' : ''
          }`}
        >
          <div className={`p-5 rounded-full mb-6 transition-all duration-400 ${
            hovered === 'student' ? 'bg-[#355c7d] text-white scale-110' : 'bg-gray-100 text-[#355c7d]'
          }`}>
            <User size={50} />
          </div>
          <h2 className="text-3xl font-bold text-[#355c7d] mb-3">Student Portal</h2>
          <p className="text-gray-500 text-center mb-10 max-w-[240px]">
            Login to access your attendance, marks, and academic assistant.
          </p>
          <button className={`group flex items-center gap-2 py-3.5 px-10 rounded-full font-bold transition-all duration-300 bg-[#355c7d] text-white hover:shadow-xl`}>
            Enter <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Admin Panel - Right */}
        <div 
          onMouseEnter={() => setHovered('admin')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => navigate('/admin-login')}
          className={`relative flex-1 flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-[400ms] ease-in-out bg-[#355c7d] ${
            hovered === 'admin' ? 'md:grow-[1.2] brightness-110' : hovered === 'student' ? 'md:grow-[0.8] opacity-80' : ''
          }`}
        >
          <div className={`p-5 rounded-full mb-6 transition-all duration-400 ${
            hovered === 'admin' ? 'bg-white text-[#355c7d] scale-110' : 'bg-white/10 text-white'
          }`}>
            <ShieldCheck size={50} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Admin Portal</h2>
          <p className="text-blue-100/70 text-center mb-10 max-w-[240px]">
            Faculty and management access for system administration.
          </p>
          <button className={`group flex items-center gap-2 py-3 px-10 rounded-full font-bold transition-all duration-300 border-2 border-white text-white hover:bg-white hover:text-[#355c7d]`}>
            Enter <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      <p className="mt-12 text-gray-500 font-medium text-sm">
        Managed University Academic Intelligence
      </p>
    </div>
  );
};

export default LoginSelectionPage;
