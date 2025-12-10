import React, { useState } from 'react';
import { CheckCircle2, Circle, ListTodo, Plus } from 'lucide-react';
import { TaskItem } from '../types';

interface AgendaWidgetProps {
  tasks: TaskItem[];
}

const AgendaWidget: React.FC<AgendaWidgetProps> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'event': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'coordination': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
        case 'event': return 'Ekitaldia';
        case 'coordination': return 'Kudeaketa';
        default: return 'Lana';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-indigo-500" />
          Agenda eta Egitekoak
        </h2>
        <button className="p-1.5 hover:bg-slate-200 rounded-md text-slate-500 transition-colors">
            <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {tasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border border-transparent
                ${task.completed ? 'opacity-60 bg-slate-50' : 'hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm'}
              `}
            >
              <button className="mt-0.5 flex-shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium transition-all ${task.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}>
                  {task.text}
                </p>
                <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${getCategoryColor(task.category)}`}>
                    {getCategoryLabel(task.category)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Aurrerapena</span>
          <span>{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AgendaWidget;
