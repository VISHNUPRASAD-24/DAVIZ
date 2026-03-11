import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell, 
  Upload,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin/overview' },
  { icon: Users, label: 'Students', path: '/admin/students' },
  { icon: GraduationCap, label: 'Academics', path: '/admin/academics' },
  { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
  { icon: FileText, label: 'Timetable', path: '/admin/timetable' },
  { icon: Upload, label: 'Exams', path: '/admin/exams' },
  { icon: CreditCard, label: 'Fees', path: '/admin/fees' },
  { icon: Bell, label: 'Notices', path: '/admin/notices' },
  { icon: Upload, label: 'Bulk Import', path: '/admin/import' },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#355c7d] text-white flex flex-col shadow-2xl fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-8 flex items-center gap-4 border-b border-white/5">
        <div className="bg-white/10 p-2.5 rounded-xl text-amber-400 shadow-inner">
          <GraduationCap size={28} />
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tight leading-none">DAVIZ</h1>
          <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.2em] mt-1">SIS Admin</p>
        </div>
      </div>
      
      <nav className="flex-1 py-10 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] ring-1 ring-white/20' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-white/40 group-hover:text-white'}`}>
                    <item.icon size={22} />
                  </div>
                  <span className={`font-semibold text-[15px] tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                    {item.label}
                  </span>
                </div>
                {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]"></div>
                )}
                {!isActive && (
                    <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/5">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-4 px-5 py-3.5 text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 group"
        >
          <div className="group-hover:rotate-12 transition-transform duration-300">
            <LogOut size={22} />
          </div>
          <span className="font-bold text-[15px] tracking-tight">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
