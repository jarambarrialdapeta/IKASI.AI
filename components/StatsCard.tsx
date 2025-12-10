import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface StatsCardProps {
  grade: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ grade }) => {
  // Mock historical data for the chart
  const data = [
    { name: 'Aste 1', value: 6.5 },
    { name: 'Aste 2', value: 7.2 },
    { name: 'Aste 3', value: 6.8 },
    { name: 'Aste 4', value: grade }, // Current
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Klaseko Batez Bestekoa</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-slate-800">{grade.toFixed(1)}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.4
            </span>
          </div>
        </div>
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <Award className="w-5 h-5" />
        </div>
      </div>

      <div className="h-24 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsCard;