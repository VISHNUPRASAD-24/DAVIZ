import React, { useState, useEffect } from 'react';
import { Search, Download, TrendingUp, CheckCircle, Clock, AlertTriangle, CreditCard, DollarSign } from 'lucide-react';
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Financial Operations</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Finance Analytics</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Real-time tuition tracking and revenue auditing system.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-[#355c7d] border border-gray-200 px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
          <Download size={18} /> Export Audit Logs
        </button>
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#355c7d] p-8 rounded-[32px] text-white shadow-2xl shadow-[#355c7d]/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <DollarSign size={80} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Total Revenue Indexed</p>
          <h3 className="text-4xl font-black tracking-tighter">₹{totalRevenue.toLocaleString()}</h3>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
             <TrendingUp size={14} className="text-emerald-400" /> +12.4% vs Last Cycle
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-300">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Unrealized Revenue</p>
            <h3 className="text-3xl font-black text-[#2c2c2c] tracking-tighter italic">₹{totalPending.toLocaleString()}</h3>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"></div>)}
            </div>
            <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-widest underline underline-offset-4 decoration-2 decoration-[#355c7d]/20 cursor-pointer hover:text-[#2c2c2c] transition-all">Audit Pending</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-300">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Defaulter Count</p>
            <h3 className="text-3xl font-black text-rose-500 tracking-tighter italic">{outstandingCount} <span className="text-xs font-bold text-gray-300 uppercase italic">Entries</span></h3>
          </div>
          <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all w-fit">
             Dispatch Notices <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-6 bg-gray-50/50">
            <h2 className="text-xl font-black text-[#2c2c2c] tracking-tighter italic uppercase">Fee Ledger Index</h2>
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search ID, Roll or Cycle Type..." 
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#355c7d]/5 focus:border-[#355c7d] transition-all text-sm font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         </div>
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">
                  <th className="px-8 py-6">Reference ID</th>
                  <th className="px-8 py-6">Transaction Meta</th>
                  <th className="px-8 py-6">Contract Value</th>
                  <th className="px-8 py-6">Settled</th>
                  <th className="px-8 py-6">Arrears</th>
                  <th className="px-8 py-6 text-center">Status Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-8 py-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing ledger matrices...</td></tr>
                ) : (filteredFees || []).length === 0 ? (
                  <tr><td colSpan="6" className="px-8 py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Zero matches found in active archives</td></tr>
                ) : (filteredFees || []).map(f => (
                  <tr key={f._id} className="group hover:bg-gray-50/80 transition-all duration-300">
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-[#355c7d] font-mono tracking-tighter group-hover:scale-110 inline-block transition-transform">{f.roll}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#355c7d]/10 group-hover:text-[#355c7d] transition-all">
                            <CreditCard size={14} />
                         </div>
                         <span className="text-[13px] font-black text-[#2c2c2c] uppercase">{f.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-[#2c2c2c] lg:text-[15px]">₹{f.totalFee?.toLocaleString()}</td>
                    <td className="px-8 py-6 font-black text-emerald-600 lg:text-[15px]">₹{f.paidAmount?.toLocaleString()}</td>
                    <td className="px-8 py-6 font-black text-rose-500 lg:text-[15px]">₹{((f.totalFee || 0) - (f.paidAmount || 0)).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-[12px] font-black text-[9px] uppercase tracking-widest border shadow-sm
                          ${f.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-1 ring-emerald-500/10' : 
                            f.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 ring-1 ring-amber-500/10' : 
                            'bg-rose-50 text-rose-600 border-rose-100 ring-1 ring-rose-500/10'}
                        `}>
                          {f.status === 'Paid' ? <CheckCircle size={14}/> : f.status === 'Pending' ? <Clock size={14}/> : <AlertTriangle size={14}/>}
                          {f.status}
                        </span>
                      </div>
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
