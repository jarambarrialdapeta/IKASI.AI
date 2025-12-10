import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bell, Search, Wrench, Timer, Dices, Users, Pause, Play, RefreshCw, X } from 'lucide-react';
import { ClassGroup, Student } from '../types';

interface HeaderProps {
  classes: ClassGroup[];
  selectedClassId: string;
  onSelectClass: (id: string) => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ classes, selectedClassId, onSelectClass, title = "Arbela" }) => {
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const [showTools, setShowTools] = useState(false);
  
  // Tools Logic State
  const [activeTool, setActiveTool] = useState<'menu' | 'timer' | 'random' | 'groups'>('menu');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [randomStudent, setRandomStudent] = useState<Student | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [groups, setGroups] = useState<Student[][]>([]);
  const [groupSize, setGroupSize] = useState(3);
  
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close tools when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setShowTools(false);
        setActiveTool('menu'); // Reset to menu
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Random Student Logic
  const pickRandomStudent = () => {
    setIsRandomizing(true);
    setRandomStudent(null);
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * currentClass.students.length);
      setRandomStudent(currentClass.students[randomIndex]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsRandomizing(false);
      }
    }, 100);
  };

  // Group Maker Logic
  const makeGroups = () => {
    const shuffled = [...currentClass.students].sort(() => 0.5 - Math.random());
    const newGroups: Student[][] = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push(shuffled.slice(i, i + groupSize));
    }
    setGroups(newGroups);
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case 'timer':
        return (
          <div className="p-4 text-center">
            <h3 className="font-bold text-slate-700 mb-4">Kronometroa</h3>
            <div className="text-4xl font-mono font-bold text-indigo-600 mb-6 bg-slate-50 py-4 rounded-xl border border-slate-100">
              {formatTime(timerSeconds)}
            </div>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-3 rounded-full text-white shadow-md transition-all active:scale-95 ${isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(300); }}
                className="p-3 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2">
               {[60, 180, 300, 600].map(sec => (
                 <button key={sec} onClick={() => { setTimerSeconds(sec); setIsTimerRunning(false); }} className="text-xs bg-slate-100 hover:bg-slate-200 py-1 rounded">
                   {sec / 60}m
                 </button>
               ))}
            </div>
          </div>
        );
      case 'random':
        return (
          <div className="p-4 text-center">
             <h3 className="font-bold text-slate-700 mb-4">Ausazko Ikaslea</h3>
             <div className="h-32 flex items-center justify-center mb-4">
               {randomStudent ? (
                 <div className={`transition-all duration-300 ${isRandomizing ? 'scale-90 opacity-70' : 'scale-110 opacity-100'}`}>
                    <img 
                      src={randomStudent.photoUrl || `https://ui-avatars.com/api/?name=${randomStudent.name}&background=random`} 
                      className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-indigo-100 shadow-sm"
                    />
                    <p className="font-bold text-lg text-slate-800">{randomStudent.name}</p>
                 </div>
               ) : (
                 <p className="text-slate-400">Sakatu botoia ikasle bat aukeratzeko</p>
               )}
             </div>
             <button 
                onClick={pickRandomStudent}
                disabled={isRandomizing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
             >
               <Dices className="w-5 h-5" />
               Aukeratu
             </button>
          </div>
        );
      case 'groups':
        return (
          <div className="p-4">
            <h3 className="font-bold text-slate-700 mb-4 text-center">Talde Sortzailea</h3>
            {groups.length === 0 ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                   <button onClick={() => setGroupSize(Math.max(2, groupSize - 1))} className="w-8 h-8 rounded-full bg-slate-100 font-bold hover:bg-slate-200">-</button>
                   <div className="text-center">
                     <span className="block text-2xl font-bold text-indigo-600">{groupSize}</span>
                     <span className="text-xs text-slate-500">ikasle taldeko</span>
                   </div>
                   <button onClick={() => setGroupSize(Math.min(10, groupSize + 1))} className="w-8 h-8 rounded-full bg-slate-100 font-bold hover:bg-slate-200">+</button>
                </div>
                <button 
                  onClick={makeGroups}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Users className="w-5 h-5" />
                  Taldeak Sortu
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-slate-500 uppercase">{groups.length} Talde sortuta</span>
                   <button onClick={() => setGroups([])} className="text-xs text-indigo-600 hover:underline">Berregin</button>
                </div>
                {groups.map((grp, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                    <span className="font-bold text-indigo-600 block mb-1">Taldea {i + 1}</span>
                    {grp.map(s => s.name).join(', ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default: // Menu
        return (
          <div className="p-2 grid grid-cols-1 gap-1">
             <button onClick={() => setActiveTool('timer')} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                   <Timer className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-bold text-slate-700">Kronometroa</p>
                   <p className="text-xs text-slate-500">Atzerako kontua</p>
                </div>
             </button>
             <button onClick={() => setActiveTool('random')} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                   <Dices className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-bold text-slate-700">Ausazkoa</p>
                   <p className="text-xs text-slate-500">Ikasle bat aukeratu</p>
                </div>
             </button>
             <button onClick={() => setActiveTool('groups')} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                   <Users className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-bold text-slate-700">Taldeak</p>
                   <p className="text-xs text-slate-500">Sortu taldeak azkar</p>
                </div>
             </button>
          </div>
        );
    }
  };

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

          {/* Tools Menu Button */}
          <div className="relative" ref={toolsRef}>
            <button 
              onClick={() => { setShowTools(!showTools); setActiveTool('menu'); }}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 border ${showTools ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-transparent hover:bg-slate-100 text-slate-500'}`}
            >
              <Wrench className="w-5 h-5" />
            </button>

            {/* Tools Popover */}
            {showTools && (
               <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 z-50 overflow-hidden">
                  {activeTool !== 'menu' && (
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                       <button onClick={() => setActiveTool('menu')} className="text-xs font-bold text-slate-500 hover:text-slate-800">← Atzera</button>
                       <button onClick={() => setShowTools(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                  {renderToolContent()}
               </div>
            )}
          </div>

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