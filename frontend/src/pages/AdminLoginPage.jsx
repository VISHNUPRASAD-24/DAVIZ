import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === '5002') {
      setError('');
      navigate('/admin-dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-400 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[360px] flex flex-col">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] transition-colors"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-[#0f3d3e] text-white rounded-md py-3 px-4 hover:bg-[#0b2b2c] transition-all duration-300 font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
