import React from 'react';
import { ChevronDown, Bell, Search } from 'lucide-react';
import { ClassGroup } from '../types';

interface HeaderProps {
  classes: ClassGroup[];
  selectedClassId: string;
  onSelectClass: (id: string) => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ classes, selectedClassId, onSelectClass, title = "Arbela" }) => {
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm h-16">
      <div className="px-8 h-full flex items-center justify-between">
        
        {/* Page Title / Left Side */}
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Search (Optional visual placeholder) */}
          <div className="hidden md:flex items-center relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3" />
             <input 
                type="text" 
                placeholder="Bilatu..." 
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-48"
             />
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* Class Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm rounded-lg px-3 py-1.5 cursor-pointer transition-all">
              <span className="text-sm font-medium text-slate-700 min-w-[140px]">
                {currentClass.name}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block animate-in fade-in slide-in-from-top-2 z-50">
              <div className="py-1">
                {classes.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onSelectClass(c.id)}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors
                      ${selectedClassId === c.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'}
                    `}
                  >
                    {c.name}
                    {selectedClassId === c.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="p-2 text-slate-400 hover:text-slate-600 relative hover:bg-slate-50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
