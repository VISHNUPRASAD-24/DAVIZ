import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '5002') {
      setError('');
      navigate('/admin-dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#d1d5db] p-4 font-sans">
      <div className="bg-white rounded-[18px] shadow-2xl p-10 w-full max-w-[420px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#355c7d]/10 p-4 rounded-full text-[#355c7d] mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-[#355c7d]">Admin Login</h2>
          <p className="text-gray-500 mt-2">Faculty & Management Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full px-5 py-3.5 pl-12 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#355c7d] focus:ring-1 focus:ring-[#355c7d] transition-all bg-gray-50/50`}
                autoFocus
              />
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#355c7d] text-white rounded-xl py-4 px-6 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#355c7d]/20"
          >
            Login <ArrowRight size={20} />
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

export default AdminLoginPage;
