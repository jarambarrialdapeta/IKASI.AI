import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import ScheduleWidget from './components/ScheduleWidget';
import AgendaWidget from './components/AgendaWidget';
import AttendanceWidget from './components/AttendanceWidget';
import { MOCK_CLASSES, TODAY_SCHEDULE, INITIAL_TASKS } from './constants';
import { BookOpen, Calendar, Users, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string>(MOCK_CLASSES[0].id);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const selectedClass = MOCK_CLASSES.find(c => c.id === selectedClassId) || MOCK_CLASSES[0];

  const getViewTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Arbela';
      case 'subjects': return 'Ikasgaiak';
      case 'students': return 'Ikasleak';
      case 'calendar': return 'Egutegia';
      case 'settings': return 'Ezarpenak';
      default: return 'Arbela';
    }
  };

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return (
        <>
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              Egun on, <span className="text-indigo-600">Irakaslea</span> 👋
            </h1>
            <p className="text-slate-500 mt-1">Hemen duzu gaurko laburpena.</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
            
            {/* Top Row: Stats & Schedule */}
            <div className="md:col-span-4 lg:col-span-3 h-[200px] md:h-auto">
              <StatsCard grade={selectedClass.averageGrade} />
            </div>

            <div className="md:col-span-8 lg:col-span-9 h-[350px] md:h-auto">
              <ScheduleWidget schedule={TODAY_SCHEDULE} />
            </div>

            {/* Bottom Row: Attendance & Agenda */}
            <div className="md:col-span-7 lg:col-span-8 h-[500px]">
              <AttendanceWidget students={selectedClass.students} />
            </div>

            <div className="md:col-span-5 lg:col-span-4 h-[500px]">
              <AgendaWidget tasks={INITIAL_TASKS} />
            </div>

          </div>
        </>
      );
    }

    // Placeholder content for other views
    let Icon = BookOpen;
    if (currentView === 'students') Icon = Users;
    if (currentView === 'calendar') Icon = Calendar;
    if (currentView === 'settings') Icon = Settings;

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-8">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{getViewTitle()}</h2>
        <p className="text-slate-500 max-w-md">
          Atal hau eraikitzen ari gara. Laster egongo da eskuragarri zure klaseak hobeto kudeatzeko.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800 flex">
      
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header 
          classes={MOCK_CLASSES} 
          selectedClassId={selectedClassId} 
          onSelectClass={setSelectedClassId}
          title={getViewTitle()}
        />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;
