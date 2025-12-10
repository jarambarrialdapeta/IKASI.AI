import React from 'react';
import { LayoutDashboard, BookOpen, Users, Calendar, Settings, GraduationCap, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Arbela', icon: LayoutDashboard },
    { id: 'subjects', label: 'Ikasgaiak', icon: BookOpen },
    { id: 'students', label: 'Ikasleak', icon: Users },
    { id: 'calendar', label: 'Egutegia', icon: Calendar },
    { id: 'settings', label: 'Ezarpenak', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Logo Area */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="bg-indigo-600 p-1.5 rounded-lg flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">IrakasleArbel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${currentView === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <item.icon className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>
      
      {/* Footer / User Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors w-full px-2 py-2 mb-2">
            <LogOut className="w-4 h-4" />
            <span>Saioa itxi</span>
        </button>
        <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200 shadow-sm">
                IR
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">Irakaslea</p>
                <p className="text-xs text-slate-500 truncate">irakaslea@eskola.eus</p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
