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
  { icon: Calendar, label: 'Attendance', path: '/admin/attendance' }, // Uses Calendar icon for attendance
  { icon: FileText, label: 'Timetable', path: '/admin/timetable' },
  { icon: Upload, label: 'Exams', path: '/admin/exams' }, // Reusing icon
  { icon: CreditCard, label: 'Fees', path: '/admin/fees' },
  { icon: Bell, label: 'Notices', path: '/admin/notices' },
  { icon: Upload, label: 'Bulk Import', path: '/admin/import' },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#0f3d3e] text-white flex flex-col shadow-xl fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="bg-yellow-400 p-2 rounded-lg text-[#0f3d3e]">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">DAVIZ SIS</h1>
          <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Admin Portal</p>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-yellow-400 text-[#0f3d3e] shadow-lg shadow-yellow-400/20' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-[#0f3d3e]' : 'text-gray-400 group-hover:text-white'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
