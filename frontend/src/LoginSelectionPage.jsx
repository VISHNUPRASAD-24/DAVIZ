import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7b733] to-[#fc4a1a] p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[400px] flex flex-col">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Select Login Portal
        </h1>
        
        <div className="flex flex-col gap-5">
          <button
            onClick={() => navigate('/student-login')}
            className="w-full bg-[#0f3d3e] text-white rounded-md py-3 px-4 hover:bg-[#0b2b2c] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-medium text-lg"
          >
            Student Login
          </button>
          
          <button
            onClick={() => navigate('/admin-login')}
            className="w-full bg-[#0f3d3e] text-white rounded-md py-3 px-4 hover:bg-[#0b2b2c] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-medium text-lg"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionPage;
