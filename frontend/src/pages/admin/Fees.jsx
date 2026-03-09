import React, { useState, useEffect } from 'react';
import { Search, Download, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setFees([]);
        setIsLoading(false);
      }
    }, 5000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/fees`);
      const data = await res.json();
      setFees(Array.isArray(data) ? data : []);
      clearTimeout(timeoutId);
    } catch (err) {
      console.error("API ERROR (fetchFees):", err);
      setFees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const feesList = Array.isArray(fees) ? fees : [];
  const filteredFees = feesList.filter(f => 
    (f.roll || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = feesList.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalPending = feesList.reduce((acc, f) => acc + ((f.totalFee || 0) - (f.paidAmount || 0)), 0);
  const outstandingCount = feesList.filter(f => f.status !== 'Paid').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
          <p className="text-gray-500 text-sm">Track fees, payments and outstanding balances</p>
        </div>
        <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
           <Download size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold uppercase tracking-wider">
         <div className="bg-gradient-to-br from-[#0f3d3e] to-[#1a6263] p-6 rounded-2xl text-white shadow-lg">
            <p className="text-[10px] opacity-70 mb-1">Total Revenue Collected</p>
            <h3 className="text-2xl">${totalRevenue.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-green-400">
               <TrendingUp size={12} /> Live Tracking
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-500 mb-1">Total Outstanding</p>
            <h3 className="text-2xl text-orange-500">${totalPending.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-orange-500/70 underline underline-offset-4 cursor-pointer">
               Generate Report
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-500 mb-1">Outstanding Records</p>
            <h3 className="text-2xl text-red-500">{outstandingCount}</h3>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-red-500/70 underline underline-offset-4 cursor-pointer">
               Send Reminders
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Fee Records</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Roll No or Type..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#0f3d3e]/10 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         </div>
         <div className="overflow-x-auto">
          <table className="w-full text-left">
              <thead className="bg-[#fcfcfc] text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Student Roll</th>
                  <th className="px-6 py-4">Fee Type</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Paid</th>
                  <th className="px-6 py-4">Pending</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading fee records...</td></tr>
                ) : (filteredFees || []).map(f => (
                  <tr key={f._id} className="text-sm hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#0f3d3e]">{f.roll}</td>
                    <td className="px-6 py-4 font-semibold text-gray-600">{f.type}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">${f.totalFee}</td>
                    <td className="px-6 py-4 font-bold text-green-600">${f.paidAmount}</td>
                    <td className="px-6 py-4 font-bold text-red-500">${(f.totalFee || 0) - (f.paidAmount || 0)}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-tighter
                        ${f.status === 'Paid' ? 'text-green-500' : f.status === 'Pending' ? 'text-orange-500' : 'text-red-500'}
                      `}>
                        {f.status === 'Paid' ? <CheckCircle size={12}/> : f.status === 'Pending' ? <Clock size={12}/> : <AlertTriangle size={12}/>}
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
         </div>
      </div>
    </div>
  );
};

export default Fees;
