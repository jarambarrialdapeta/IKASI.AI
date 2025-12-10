import React, { useState, useEffect } from 'react';
import { Users, Check, X, Clock, ArrowDownAZ } from 'lucide-react';
import { Student } from '../types';

interface AttendanceWidgetProps {
  students: Student[];
}

const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({ students: initialStudents }) => {
  const [studentStates, setStudentStates] = useState<Student[]>([]);

  // Sort by Surname helper
  const sortBySurname = (students: Student[]) => {
    return [...students].sort((a, b) => {
      const surnameA = a.name.split(' ').slice(-1)[0]; // Takes last word as surname
      const surnameB = b.name.split(' ').slice(-1)[0];
      return surnameA.localeCompare(surnameB);
    });
  };

  // Update internal state when props change (class switch)
  useEffect(() => {
    setStudentStates(sortBySurname(initialStudents));
  }, [initialStudents]);

  const updateStatus = (id: string, status: Student['status']) => {
    setStudentStates(prev => prev.map(s => 
      s.id === id ? { ...s, status } : s
    ));
  };

  const stats = {
    present: studentStates.filter(s => s.status === 'present').length,
    absent: studentStates.filter(s => s.status === 'absent').length,
    late: studentStates.filter(s => s.status === 'late').length,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Asistentzia
          </h2>
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">
             <ArrowDownAZ className="w-3 h-3" />
             A-Z
          </span>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-emerald-700">{stats.present}</div>
            <div className="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold">Bertan</div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-rose-700">{stats.absent}</div>
            <div className="text-[10px] uppercase tracking-wide text-rose-600 font-semibold">Falta</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-amber-700">{stats.late}</div>
            <div className="text-[10px] uppercase tracking-wide text-amber-600 font-semibold">Berandu</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">Ikaslea</th>
              <th className="px-4 py-3 text-right">Egoera</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studentStates.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img 
                            src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name}&background=random`} 
                            alt={student.name}
                            className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
                        />
                        <span className="font-medium text-slate-700">{student.name}</span>
                    </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => updateStatus(student.id, 'present')}
                      className={`p-1.5 rounded-md transition-all ${
                        student.status === 'present' 
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200 opacity-100' 
                        : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                      }`}
                      title="Bertan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(student.id, 'late')}
                      className={`p-1.5 rounded-md transition-all ${
                        student.status === 'late' 
                        ? 'bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-200 opacity-100' 
                        : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                      }`}
                      title="Berandu"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(student.id, 'absent')}
                      className={`p-1.5 rounded-md transition-all ${
                        student.status === 'absent' 
                        ? 'bg-rose-100 text-rose-700 shadow-sm ring-1 ring-rose-200 opacity-100' 
                        : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                      }`}
                      title="Falta"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceWidget;