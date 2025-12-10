import React from 'react';
import { CalendarClock, MapPin } from 'lucide-react';
import { ScheduleItem } from '../types';

interface ScheduleWidgetProps {
  schedule: ScheduleItem[];
}

const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({ schedule }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-indigo-500" />
          Gaurko Ordutegia
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-slate-200"></div>

          <div className="space-y-6">
            {schedule.map((item) => (
              <div key={item.id} className="relative flex items-center group">
                {/* Time */}
                <div className="w-[5.5rem] pr-4 text-right">
                  <span className="text-xs font-semibold text-slate-500 block">{item.time.split(' - ')[0]}</span>
                  <span className="text-[10px] text-slate-400 block">{item.time.split(' - ')[1]}</span>
                </div>

                {/* Dot on line */}
                <div className="absolute left-[5.5rem] w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-400 -translate-x-[5px] z-10 group-hover:scale-125 transition-transform"></div>

                {/* Content Card */}
                <div className={`flex-1 ml-4 p-3 rounded-lg border border-transparent shadow-sm hover:shadow-md transition-all ${item.color}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm">{item.subject}</h3>
                    <div className="flex items-center text-[10px] opacity-80 gap-1 bg-white/40 px-1.5 py-0.5 rounded">
                      <MapPin className="w-3 h-3" />
                      {item.room}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleWidget;
