import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import ScheduleWidget from './components/ScheduleWidget';
import AgendaWidget from './components/AgendaWidget';
import AttendanceWidget from './components/AttendanceWidget';
import { MOCK_CLASSES, TODAY_SCHEDULE, INITIAL_TASKS, MOCK_STUDENT_STATS, MOCK_EVENTS } from './constants';
import { Exercise, Meeting } from './types';
import { 
  BookOpen, Calendar, Users, Settings, Database, Calculator, 
  Globe, Languages, Book, HardDrive, ArrowLeft, Ear, PenTool, 
  BookType, WholeWord, Plus, FileText, Send, MoreVertical, X,
  Upload, List, HelpCircle, CheckSquare, Sparkles, Brain, Sigma, Puzzle,
  TrendingUp, AlertCircle, Clock, Save, FileDown, Search, BarChart3, Layout,
  Table, ChevronLeft, ChevronRight, Bot, Trash2, PieChart as PieChartIcon, Activity,
  MessageSquare, Mic, FileAudio, CheckCircle, Filter, Library, Layers, GraduationCap, Network,
  PenLine, GraduationCap as GradeIcon, ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';

// Define a type for Gradebook Assignments
interface Assignment {
  id: string;
  title: string;
  date: string;
  maxScore: number;
}

// Types for the Exercise Bank
interface BankExercise {
  id: string;
  subject: string;
  area: string; // Alorra
  topic: string; // Gaia
  title: string;
  difficulty: 'Erraza' | 'Ertaina' | 'Zaila';
}

const App: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string>(MOCK_CLASSES[0].id);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  // Navigation State for Subjects
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjectViewMode, setSubjectViewMode] = useState<'exercises' | 'gradebook'>('exercises');
  const [activeCategory, setActiveCategory] = useState<string>('ulermena');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Curriculum / Evaluation Planning State
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>('LH 5. Maila');
  const [openEvalModal, setOpenEvalModal] = useState<number | null>(null); // 1, 2, or 3
  const [curriculumData, setCurriculumData] = useState<Record<string, string>>({
    'LH 5. Maila-1': 'Zenbaki arruntak: irakurketa eta idazketa.\nEragiketak: Batuketak, kenketak eta biderketak.\nBuruketak ebazteko estrategiak.',
    'LH 5. Maila-2': 'Zatikiak: kontzeptua eta eragiketa errazak.\nZenbaki hamartarrak eguneroko bizitzan.\nGeometria: Angeluak eta poligonoak.',
    'LH 5. Maila-3': 'Neurriak: Luzera, masa eta edukiera.\nEstatistika eta probabilitatea.\nIkasturteko errepaso orokorra.',
    'LH 4. Maila-1': 'Zenbakiak 1.000.000 arte.',
  });


  // Exercise Builder State
  const [builderSubject, setBuilderSubject] = useState<string>('');
  const [builderArea, setBuilderArea] = useState<string>('');
  const [builderTopic, setBuilderTopic] = useState<string>('');
  const [selectedBankExercises, setSelectedBankExercises] = useState<BankExercise[]>([]);

  // Student Detail State
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentViewMode, setStudentViewMode] = useState<'general' | 'subjects' | 'sociogram'>('general');
  const [selectedStudentSubject, setSelectedStudentSubject] = useState<string>('Matematika');
  const [teacherNote, setTeacherNote] = useState(MOCK_STUDENT_STATS.teacherNotes);
  const [isAiGenerating, setIsAiGenerating] = useState(false); // AI State

  // Meetings State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([
    { 
      id: 'm1', 
      title: 'Zikloko Koordinazioa', 
      date: '2023-10-24', 
      type: 'coordination', 
      participants: ['Ana', 'Jon', 'Mikel'],
      status: 'completed',
      summary: 'Datorren asteko txangoa antolatu dugu. Autobusa 9:00etan aterako da. Gurasoen baimenak ostiralerako jaso behar dira.'
    },
    { 
      id: 'm2', 
      title: 'Guraso Bilera - 5. Maila', 
      date: '2023-10-20', 
      type: 'parents', 
      participants: ['Guraso Ordezkariak'],
      status: 'completed',
      summary: 'Jantokiko arautegiaren inguruko kezkak azaldu dituzte. Gabonetako jaialdirako laguntza eskatu dute.'
    }
  ]);
  const [newMeetingSummary, setNewMeetingSummary] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Gradebook State (Dynamic Columns)
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 'a1', title: '1. Ebaluazioa', date: '2023-10-15', maxScore: 10 },
    { id: 'a2', title: 'Zatikiak', date: '2023-10-22', maxScore: 10 },
    { id: 'a3', title: 'Problemak', date: '2023-10-29', maxScore: 10 },
    { id: 'a4', title: 'Kalkulua', date: '2023-11-05', maxScore: 10 },
  ]);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock Exercises Data
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', title: 'Ipuinaren ulermena: "Basoko Misterioa"', description: 'Fitxategia aztertuta - 5 Galdera', category: 'ulermena', status: 'published', date: '2023-10-24' },
    { id: '2', title: 'Aditz laguntzailea: NOR-NORI-NORK', description: 'Bete hutsuneak taulan.', category: 'gramatika', status: 'published', date: '2023-10-22' },
    { id: '3', title: 'Sinonimoak eta Antonimoak', description: 'Lotu hitzak bere bikotearekin.', category: 'lexikoa', status: 'draft', date: '2023-10-25' },
    { id: '4', title: 'Biderketa taulak errepasatzen', description: '3, 4 eta 6ko taulak', category: 'aritmetika', status: 'published', date: '2023-10-26' },
  ]);

  // DATA BANK STRUCTURE
  const SUBJECT_HIERARCHY: any = {
    'Matematika': {
      'Aritmetika': ['Zatikiak', 'Zenbaki Hamartarrak', 'Eragiketak'],
      'Geometria': ['Angeluak', 'Poligonoak', 'Perimetroa'],
      'Neurriak': ['Luzera', 'Pisua', 'Edukiera']
    },
    'Euskara': {
      'Ulermena': ['Idatzizko Ulermena', 'Entzumena'],
      'Gramatika': ['Aditzak', 'Deklinabidea', 'Sintaxia'],
      'Idazmena': ['Deskribapena', 'Iritzi Testua']
    },
    'Ingelesa': {
      'Writing': ['Description', 'Letter', 'Story'],
      'Grammar': ['Present Simple', 'Past Continuous'],
      'Vocabulary': ['Animals', 'House', 'School']
    }
  };

  const BANK_EXERCISES: BankExercise[] = [
    { id: 'b1', subject: 'Matematika', area: 'Aritmetika', topic: 'Zatikiak', title: 'Zatiki baliokideak bilatu', difficulty: 'Erraza' },
    { id: 'b2', subject: 'Matematika', area: 'Aritmetika', topic: 'Zatikiak', title: 'Zatikien batuketak', difficulty: 'Ertaina' },
    { id: 'b3', subject: 'Euskara', area: 'Ulermena', topic: 'Idatzizko Ulermena', title: 'Testuaren ideia nagusia', difficulty: 'Ertaina' },
    { id: 'b4', subject: 'Ingelesa', area: 'Writing', topic: 'Description', title: 'Describe your best friend', difficulty: 'Erraza' },
    { id: 'b5', subject: 'Matematika', area: 'Geometria', topic: 'Angeluak', title: 'Angelu motak sailkatu', difficulty: 'Erraza' },
    { id: 'b6', subject: 'Euskara', area: 'Gramatika', topic: 'Aditzak', title: 'NOR-NORI orainaldian', difficulty: 'Zaila' },
  ];

  const selectedClass = MOCK_CLASSES.find(c => c.id === selectedClassId) || MOCK_CLASSES[0];

  const getViewTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Arbela';
      case 'subjects': return selectedSubject ? selectedSubject : 'Ikasgaiak';
      case 'students': return 'Ikasleen Jarraipena';
      case 'calendar': return 'Egutegia';
      case 'meetings': return 'Bilerak eta Aktak';
      case 'settings': return 'Ezarpenak';
      default: return 'Arbela';
    }
  };

  // Helper function for localization
  const getLocalizedLabels = (subject: string | null) => {
    // Default Euskara
    return {
      createTitle: 'Ariketa Sortzailea',
      subtitle: 'Igo fitxategia galdetegia automatikoki sortzeko.',
      upload: 'Klikatu edo arrastatu fitxategia',
      titleLabel: 'Izenburua',
      qCount: 'Galderak',
      qType: 'Galdetegi mota',
      types: { multiple: 'Aukera anitzekoa', boolean: 'Egia / Gezurra', open: 'Erantzun irekia' },
      createBtn: 'Sortu Galdetegia',
      exerciseTitlePlaceholder: 'Ariketaren Izenburua',
      listTitle: 'Eskuragarri dauden Ariketak',
      emptyState: 'Ez dago ariketarik atal honetan oraindik.',
      viewBtn: 'Ikusi',
      draft: 'Zirriborroa',
      published: 'Bidalita'
    };
  };

  // AI Generator Function
  const generateReport = () => {
    setIsAiGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const aiText = `${selectedClass.students.find(s=>s.id === selectedStudentId)?.name || 'Ikaslea'}k bilakaera positiboa erakutsi du hiruhileko honetan. ${selectedStudentSubject}n bereziki ondo moldatzen da, nahiz eta arreta mantentzea kostatzen zaion batzuetan. Etxeko lanak orokorrean garaiz entregatzen ditu eta jarrera egokia du gelan. Gomendagarria litzateke irakurketan errefortzu txiki bat egitea etxean.`;
      setTeacherNote(aiText);
      setIsAiGenerating(false);
    }, 2000);
  };

  const generateMeetingSummary = () => {
    setIsTranscribing(true);
    setTimeout(() => {
        setNewMeetingSummary(`BILERA LABURPENA\n\n1. Gai nagusia: Datorren asteko ebaluazioa.\n2. Erabakiak:\n   - Azterketa eguna aldatu (Ostegunera).\n   - Gurasoei oharra bidali.\n3. Hurrengo urratsak:\n   - Materiala prestatu astelehenerako.\n   - Zuzendaritzarekin hitz egin gelako proiektorearen inguruan.`);
        setIsTranscribing(false);
    }, 2500);
  };

  const handleCreateMeeting = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newMeeting: Meeting = {
          id: Date.now().toString(),
          title: formData.get('title') as string,
          date: new Date().toISOString().split('T')[0],
          type: 'coordination', // simplified for demo
          participants: ['Irakasleak'],
          status: 'completed',
          summary: newMeetingSummary
      };
      setMeetings([newMeeting, ...meetings]);
      setShowMeetingModal(false);
      setNewMeetingSummary('');
  };

  const handleAddAssignment = () => {
    const newId = `a${assignments.length + 1}`;
    const newAssignment: Assignment = {
      id: newId,
      title: `Ariketa ${assignments.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      maxScore: 10
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleCreateExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isLanguageSubject = ['Euskara', 'Gaztelera', 'Ingelesa'].includes(selectedSubject || '');
    const isUlermena = activeCategory === 'ulermena' && isLanguageSubject;
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: isUlermena 
        ? `Analitika Automatik - ${formData.get('questionCount')} Qs`
        : formData.get('description') as string,
      category: activeCategory as any,
      status: 'published',
      date: new Date().toISOString().split('T')[0]
    };
    
    setExercises([newExercise, ...exercises]);
    setShowCreateModal(false);
  };

  const handleAddBankExercise = (ex: BankExercise) => {
    if (!selectedBankExercises.find(e => e.id === ex.id)) {
      setSelectedBankExercises([...selectedBankExercises, ex]);
    }
  };

  const handleRemoveBankExercise = (id: string) => {
    setSelectedBankExercises(selectedBankExercises.filter(e => e.id !== id));
  };

  // -------------------------
  // Calendar View Renderer
  // -------------------------
  const renderCalendarView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start
    const totalDays = lastDay.getDate();
    
    const monthNames = ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];
    
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const renderCalendarDays = () => {
      const days = [];
      // Empty cells for previous month
      for (let i = 0; i < startingDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50 border border-slate-100/50"></div>);
      }
      
      // Days of the month
      for (let i = 1; i <= totalDays; i++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        const dayEvents = MOCK_EVENTS.filter(e => e.date === dateStr);
        const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

        days.push(
          <div key={i} className={`h-32 border border-slate-100 p-2 relative group hover:bg-slate-50 transition-colors ${isToday ? 'bg-indigo-50/30' : 'bg-white'}`}>
             <div className="flex justify-between items-start">
               <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                 {i}
               </span>
               <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-600 transition-opacity">
                 <Plus className="w-4 h-4" />
               </button>
             </div>
             <div className="mt-2 space-y-1">
               {dayEvents.map(ev => (
                 <div key={ev.id} className={`text-[10px] px-1.5 py-1 rounded truncate font-medium
                    ${ev.type === 'exam' ? 'bg-rose-100 text-rose-700' : 
                      ev.type === 'holiday' ? 'bg-emerald-100 text-emerald-700' :
                      ev.type === 'meeting' ? 'bg-amber-100 text-amber-700' :
                      'bg-indigo-100 text-indigo-700'}
                 `}>
                   {ev.title}
                 </div>
               ))}
             </div>
          </div>
        );
      }
      return days;
    };

    return (
      <div className="animate-in fade-in duration-500">
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-800 capitalize">
                {monthNames[month]} {year}
              </h2>
              <div className="flex bg-white rounded-lg border border-slate-200 shadow-sm p-1">
                 <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
                 <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronRight className="w-5 h-5"/></button>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-indigo-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Gertaera Berria
            </button>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
               {['Al', 'Ar', 'Az', 'Og', 'Ol', 'Lr', 'Ig'].map(day => (
                 <div key={day} className="py-3 text-center text-sm font-bold text-slate-500">{day}</div>
               ))}
            </div>
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
         </div>
      </div>
    );
  };

  // -------------------------
  // Meetings View Renderer
  // -------------------------
  const renderMeetingsView = () => {
    return (
        <div className="animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                       <MessageSquare className="w-6 h-6 text-indigo-600" />
                       Bilerak eta Aktak
                   </h2>
                   <p className="text-slate-500 text-sm mt-1">Grabatu audioa edo igo aktak laburpenak automatikoki sortzeko.</p>
                </div>
                <button 
                  onClick={() => setShowMeetingModal(true)}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 flex items-center gap-2 transition-all hover:shadow-md"
                >
                   <Plus className="w-4 h-4" /> 
                   Bilera Berria
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                                ${meeting.type === 'coordination' ? 'bg-blue-100 text-blue-700' : 
                                  meeting.type === 'parents' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}
                            `}>
                                {meeting.type === 'coordination' ? 'Koordinazioa' : meeting.type === 'parents' ? 'Gurasoak' : 'Saila'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{meeting.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{meeting.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-4 flex-1 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {meeting.summary || "Laburpenik gabe..."}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                            <div className="flex -space-x-2">
                                {meeting.participants.map((p, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600">
                                        {p[0]}
                                    </div>
                                ))}
                            </div>
                            <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1">
                                Ikusi Akta <ArrowLeft className="w-3 h-3 rotate-180" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Card */}
                <button 
                  onClick={() => setShowMeetingModal(true)}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all min-h-[250px]"
                >
                    <div className="p-4 bg-slate-50 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Mic className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-sm">Hasi Grabaketa edo Igo Audioa</span>
                    <span className="text-xs mt-1 opacity-70">AI Laburpena sortzeko</span>
                </button>
             </div>

             {/* Modal */}
             {showMeetingModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Bilera Berria Erregistratu</h3>
                                <p className="text-sm text-slate-500">Igo audioa edo idatzi oharrak.</p>
                            </div>
                            <button onClick={() => setShowMeetingModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                        </div>
                        
                        <form onSubmit={handleCreateMeeting} className="p-6 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Bileraren Izenburua</label>
                                    <input name="title" required type="text" placeholder="Adib: Ebaluazio Batzordea" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Data</label>
                                    <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-purple-600" />
                                    Sortu Akta Automatikoki
                                </label>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div 
                                      className="border-2 border-dashed border-purple-200 bg-white rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors"
                                      onClick={generateMeetingSummary}
                                    >
                                        <Mic className={`w-8 h-8 text-purple-500 mb-2 ${isTranscribing ? 'animate-pulse' : ''}`} />
                                        <span className="text-sm font-bold text-purple-700">Audioa Grabatu</span>
                                        <span className="text-xs text-slate-400">Mikrofonoa erabili</span>
                                    </div>
                                    <div 
                                      className="border-2 border-dashed border-indigo-200 bg-white rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors"
                                      onClick={generateMeetingSummary}
                                    >
                                        <FileAudio className="w-8 h-8 text-indigo-500 mb-2" />
                                        <span className="text-sm font-bold text-indigo-700">Igo Artxiboa</span>
                                        <span className="text-xs text-slate-400">MP3, WAV, M4A</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {isTranscribing ? 'AI Laburpena sortzen...' : 'Bileraren Laburpena / Akta'}
                                </label>
                                <textarea 
                                    value={newMeetingSummary}
                                    onChange={(e) => setNewMeetingSummary(e.target.value)}
                                    rows={8}
                                    className={`w-full p-4 border rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none transition-all
                                        ${isTranscribing ? 'bg-slate-50 text-slate-400 animate-pulse border-slate-200' : 'bg-white border-slate-300 text-slate-700'}
                                    `}
                                    placeholder="Hemen agertuko da sortutako laburpena edo eskuz idatzi dezakezu..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowMeetingModal(false)} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Utzi</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Gorde Bilera
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
             )}
        </div>
    );
  };

  const renderSubjectDetail = () => {
    let categories;
    let SubjectIcon = BookOpen;

    if (selectedSubject === 'Matematika') {
      SubjectIcon = Calculator;
      categories = [
        { id: 'kalkulu_mentala', label: 'Kalkulu Mentala', icon: Brain, color: 'text-pink-600 bg-pink-50' },
        { id: 'aritmetika', label: 'Aritmetika', icon: Sigma, color: 'text-blue-600 bg-blue-50' },
        { id: 'buruketak', label: 'Buruketak', icon: HelpCircle, color: 'text-amber-600 bg-amber-50' },
      ];
    } else {
      SubjectIcon = Book;
      categories = [
        { id: 'ulermena', label: 'Ulermena', icon: Ear, color: 'text-blue-600 bg-blue-50' },
        { id: 'idazmena', label: 'Idazmena', icon: PenTool, color: 'text-emerald-600 bg-emerald-50' },
        { id: 'gramatika', label: 'Gramatika', icon: BookType, color: 'text-amber-600 bg-amber-50' },
        { id: 'lexikoa', label: 'Lexikoa', icon: WholeWord, color: 'text-purple-600 bg-purple-50' },
      ];
    }

    const filteredExercises = exercises.filter(ex => ex.category === activeCategory);
    const isLanguageSubject = ['Euskara', 'Gaztelera', 'Ingelesa'].includes(selectedSubject || '');
    
    const showInlineForm = isLanguageSubject && activeCategory === 'ulermena';
    
    const labels = getLocalizedLabels(selectedSubject);

    // Save Curriculum Handler
    const handleSaveCurriculum = (e: React.FormEvent) => {
      e.preventDefault();
      setOpenEvalModal(null);
      // Here you would typically save the `curriculumData` to a backend
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Navigation Header inside Subject */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setSelectedSubject(null)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <SubjectIcon className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-800">{selectedSubject}</h2>
            </div>
            
            {/* New Controls for Grade & Evaluation Planning */}
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <select 
                        value={selectedGradeLevel}
                        onChange={(e) => setSelectedGradeLevel(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        <option>LH 1. Maila</option>
                        <option>LH 2. Maila</option>
                        <option>LH 3. Maila</option>
                        <option>LH 4. Maila</option>
                        <option>LH 5. Maila</option>
                        <option>LH 6. Maila</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                
                <div className="h-4 w-px bg-slate-200"></div>

                <div className="flex gap-2">
                    {[1, 2, 3].map(evalNum => (
                        <button 
                            key={evalNum}
                            onClick={() => setOpenEvalModal(evalNum)}
                            className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-1.5"
                        >
                            <PenLine className="w-3 h-3" />
                            {evalNum}. Ebaluazioa
                        </button>
                    ))}
                </div>
            </div>
          </div>

          {/* Only show the top Create button if NOT in Ulermena */}
          {!showInlineForm && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              Ariketa Sortu
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className={`grid grid-cols-2 md:grid-cols-${categories.length} gap-4 mb-8`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left
                ${activeCategory === cat.id 
                  ? 'border-indigo-600 ring-1 ring-indigo-600 bg-white shadow-md' 
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}
              `}
            >
              <div className={`p-2 rounded-lg ${cat.color}`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <span className={`font-semibold ${activeCategory === cat.id ? 'text-slate-800' : 'text-slate-500'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Exercises Content */}
          <>
            {showInlineForm ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col lg:flex-row">
                {/* Left Side: Creation Panel */}
                <div className="lg:w-7/12 p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
                   <div className="mb-6">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                         <Sparkles className="w-5 h-5 text-indigo-600" />
                         {labels.createTitle}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">{labels.subtitle}</p>
                   </div>

                   <form onSubmit={handleCreateExercise} className="space-y-6">
                      <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">{labels.titleLabel}</label>
                          <input 
                            name="title"
                            required
                            type="text" 
                            placeholder={labels.exerciseTitlePlaceholder} 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                          />
                      </div>

                      {/* Upload Zone */}
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <Upload className="w-6 h-6 text-indigo-600" />
                          </div>
                          <p className="text-sm font-medium text-slate-700">{labels.upload}</p>
                          <p className="text-xs text-slate-400 mt-1">PDF, DOCX, MP3, MP4</p>
                      </div>

                      {/* Config */}
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">{labels.qCount}</label>
                            <input 
                                name="questionCount"
                                type="number" 
                                min="1"
                                max="20"
                                defaultValue="5"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">{labels.qType}</label>
                            <select 
                                name="quizType"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="multiple">{labels.types.multiple}</option>
                                <option value="boolean">{labels.types.boolean}</option>
                                <option value="open">{labels.types.open}</option>
                            </select>
                         </div>
                      </div>

                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
                          <List className="w-5 h-5" />
                          {labels.createBtn}
                      </button>
                   </form>
                </div>

                {/* Right Side: List Panel */}
                <div className="lg:w-5/12 bg-slate-50/50 flex flex-col h-full lg:min-h-[700px]">
                   <div className="p-5 border-b border-slate-100 bg-slate-50">
                      <h4 className="font-bold text-slate-700 flex items-center gap-2">
                         <List className="w-4 h-4 text-slate-500" />
                         {labels.listTitle}
                      </h4>
                   </div>
                   <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {filteredExercises.length === 0 ? (
                         <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center p-6">
                            <FileText className="w-12 h-12 mb-3 opacity-20" />
                            <p>{labels.emptyState}</p>
                         </div>
                      ) : (
                         filteredExercises.map((exercise) => (
                           <div key={exercise.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                               <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{exercise.date}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${exercise.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                     {exercise.status === 'published' ? labels.published : labels.draft}
                                  </span>
                               </div>
                               <h5 className="font-bold text-slate-800 text-sm mb-1">{exercise.title}</h5>
                               <p className="text-xs text-slate-500 line-clamp-2 mb-4">{exercise.description}</p>
                               
                               <button className="w-full py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                                  {labels.viewBtn}
                               </button>
                           </div>
                         ))
                      )}
                   </div>
                </div>
              </div>
            ) : (
              // Standard List View for other categories
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {categories.find(c => c.id === activeCategory)?.label || 'Ariketak'} - {labels.listTitle}
                  </h3>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    {filteredExercises.length}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {filteredExercises.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <p>{labels.emptyState}</p>
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="text-indigo-600 font-medium text-sm mt-2 hover:underline"
                      >
                        Sortu lehenengoa
                      </button>
                    </div>
                  ) : (
                    filteredExercises.map((exercise) => (
                      <div key={exercise.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-slate-100 rounded text-slate-400 mt-1">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{exercise.title}</h4>
                            <p className="text-sm text-slate-500 mb-1">{exercise.description}</p>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-slate-400">{exercise.date}</span>
                              {exercise.status === 'published' ? (
                                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Send className="w-3 h-3" /> {labels.published}
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                                  {labels.draft}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>

        {/* Modal for Creating Exercise */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Ariketa Berria Sortu</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateExercise} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ariketaren Izenburua</label>
                  <input 
                    name="title"
                    required
                    type="text" 
                    placeholder="Adib: Zatikiak batzen" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategoria</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deskribapena / Argibideak</label>
                  <textarea 
                    name="description"
                    required
                    rows={3}
                    placeholder="Zer egin behar dute ikasleek?" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  ></textarea>
                </div>
                
                <div className="pt-4 flex gap-3 justify-end">
                   <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                   >
                     Utzi
                   </button>
                   <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                   >
                     Sortu eta Bidali
                   </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Evaluation Curriculum Planning */}
        {openEvalModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                          <GradeIcon className="w-5 h-5" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800">{openEvalModal}. Ebaluazioaren Edukia</h3>
                          <p className="text-sm text-slate-500">{selectedSubject} - {selectedGradeLevel}</p>
                      </div>
                  </div>
                  <button onClick={() => setOpenEvalModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSaveCurriculum} className="p-6 overflow-y-auto flex-1 flex flex-col">
                  <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                         Zer landuko da ebaluazio honetan?
                      </label>
                      <textarea 
                         rows={12}
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm leading-relaxed resize-none"
                         placeholder="Idatzi hemen gaiak, estandarrak eta helburuak..."
                         value={curriculumData[`${selectedGradeLevel}-${openEvalModal}`] || ''}
                         onChange={(e) => setCurriculumData({...curriculumData, [`${selectedGradeLevel}-${openEvalModal}`]: e.target.value})}
                      />
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-auto">
                      <button type="button" onClick={() => setOpenEvalModal(null)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Utzi</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Gorde Aldaketak
                      </button>
                  </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExerciseBankBuilder = () => {
    // Filter available areas based on selected subject
    const availableAreas = builderSubject ? Object.keys(SUBJECT_HIERARCHY[builderSubject] || {}) : [];
    // Filter available topics based on selected area
    const availableTopics = (builderSubject && builderArea) ? SUBJECT_HIERARCHY[builderSubject][builderArea] || [] : [];
    
    // Filter exercises from the bank
    const filteredBankExercises = BANK_EXERCISES.filter(ex => {
       if (builderSubject && ex.subject !== builderSubject) return false;
       if (builderArea && ex.area !== builderArea) return false;
       if (builderTopic && ex.topic !== builderTopic) return false;
       return true;
    });

    return (
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-8">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                   <Database className="w-6 h-6" />
               </div>
               <div>
                   <h3 className="text-xl font-bold text-slate-800">Sortu zure ariketa / Datu Bankua</h3>
                   <p className="text-sm text-slate-500">Bilatu ariketak ikasgai, alor eta gaiaren arabera.</p>
               </div>
           </div>

           <div className="flex flex-col lg:flex-row gap-8">
               {/* FILTERS COLUMN */}
               <div className="lg:w-1/3 space-y-5">
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                           <Book className="w-4 h-4 text-slate-400" />
                           1. Aukeratu Ikasgaia
                       </label>
                       <select 
                           value={builderSubject}
                           onChange={(e) => {
                               setBuilderSubject(e.target.value);
                               setBuilderArea('');
                               setBuilderTopic('');
                           }}
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                       >
                           <option value="">Aukeratu ikasgaia...</option>
                           {Object.keys(SUBJECT_HIERARCHY).map(sub => (
                               <option key={sub} value={sub}>{sub}</option>
                           ))}
                       </select>
                   </div>

                   <div>
                       <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${!builderSubject ? 'text-slate-400' : 'text-slate-700'}`}>
                           <Layers className="w-4 h-4" />
                           2. Aukeratu Alorra
                       </label>
                       <select 
                           value={builderArea}
                           onChange={(e) => {
                               setBuilderArea(e.target.value);
                               setBuilderTopic('');
                           }}
                           disabled={!builderSubject}
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                       >
                           <option value="">Aukeratu alorra...</option>
                           {availableAreas.map(area => (
                               <option key={area} value={area}>{area}</option>
                           ))}
                       </select>
                   </div>

                   <div>
                       <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${!builderArea ? 'text-slate-400' : 'text-slate-700'}`}>
                           <Filter className="w-4 h-4" />
                           3. Aukeratu Gaia
                       </label>
                       <select 
                           value={builderTopic}
                           onChange={(e) => setBuilderTopic(e.target.value)}
                           disabled={!builderArea}
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                       >
                           <option value="">Aukeratu gaia...</option>
                           {availableTopics.map((topic: string) => (
                               <option key={topic} value={topic}>{topic}</option>
                           ))}
                       </select>
                   </div>

                   {/* RESULTS LIST MINI */}
                   <div className="mt-6 pt-4 border-t border-slate-100">
                       <h4 className="font-bold text-slate-800 text-sm mb-3">Emaitzak ({filteredBankExercises.length})</h4>
                       <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                           {filteredBankExercises.length === 0 ? (
                               <p className="text-xs text-slate-400 italic">Ez da ariketarik aurkitu irizpide hauekin.</p>
                           ) : (
                               filteredBankExercises.map(ex => (
                                   <div key={ex.id} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex justify-between items-center group">
                                       <div className="flex-1 min-w-0 mr-2">
                                           <p className="text-sm font-bold text-slate-700 truncate">{ex.title}</p>
                                           <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                               ex.difficulty === 'Erraza' ? 'bg-emerald-100 text-emerald-700' : 
                                               ex.difficulty === 'Ertaina' ? 'bg-amber-100 text-amber-700' : 
                                               'bg-rose-100 text-rose-700'
                                           }`}>
                                               {ex.difficulty}
                                           </span>
                                       </div>
                                       <button 
                                           onClick={() => handleAddBankExercise(ex)}
                                           className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition-colors"
                                       >
                                           <Plus className="w-4 h-4" />
                                       </button>
                                   </div>
                               ))
                           )}
                       </div>
                   </div>
               </div>

               {/* SELECTED EXERCISES "CART" */}
               <div className="lg:w-2/3 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                       <h4 className="font-bold text-slate-800 flex items-center gap-2">
                           <Library className="w-5 h-5 text-indigo-600" />
                           Zure Ariketa Sorta ({selectedBankExercises.length})
                       </h4>
                       <button 
                           onClick={() => setSelectedBankExercises([])}
                           disabled={selectedBankExercises.length === 0}
                           className="text-xs text-rose-600 hover:text-rose-800 font-medium disabled:opacity-0 transition-opacity"
                       >
                           Garbitu zerrenda
                       </button>
                   </div>

                   <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] mb-4 bg-white rounded-lg border border-slate-200 p-4 shadow-inner">
                       {selectedBankExercises.length === 0 ? (
                           <div className="h-full flex flex-col items-center justify-center text-slate-400">
                               <Layers className="w-12 h-12 mb-3 opacity-20" />
                               <p className="text-sm">Zure saskia hutsik dago.</p>
                               <p className="text-xs mt-1">Aukeratu ariketak ezkerreko menuan.</p>
                           </div>
                       ) : (
                           selectedBankExercises.map((ex, index) => (
                               <div key={`${ex.id}-${index}`} className="flex items-start gap-4 p-4 border border-slate-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                                   <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 mt-0.5">
                                       {index + 1}
                                   </div>
                                   <div className="flex-1">
                                       <div className="flex items-center gap-2 mb-1">
                                           <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 rounded">{ex.subject}</span>
                                           <span className="text-[10px] text-slate-400">•</span>
                                           <span className="text-[10px] text-slate-500">{ex.area} / {ex.topic}</span>
                                       </div>
                                       <h5 className="font-bold text-slate-800">{ex.title}</h5>
                                   </div>
                                   <button 
                                       onClick={() => handleRemoveBankExercise(ex.id)}
                                       className="text-slate-300 hover:text-rose-500 p-2 transition-colors"
                                   >
                                       <Trash2 className="w-4 h-4" />
                                   </button>
                               </div>
                           ))
                       )}
                   </div>

                   <div className="flex justify-end pt-4 border-t border-slate-200">
                       <button 
                           disabled={selectedBankExercises.length === 0}
                           className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                       >
                           <Save className="w-4 h-4" />
                           Gorde eta Sortu PDF
                       </button>
                   </div>
               </div>
           </div>
       </div>
    );
  };

  const renderSubjectsSection = () => {
    // If a subject is selected, show the detail view
    if (selectedSubject) {
        return renderSubjectDetail();
    }

    const subjects = [
      { name: 'Euskara', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700', students: 24, avg: 7.2 },
      { name: 'Gaztelera', icon: Book, color: 'bg-orange-100 text-orange-700', students: 24, avg: 6.8 },
      { name: 'Inguru', icon: Globe, color: 'bg-blue-100 text-blue-700', students: 24, avg: 7.5 },
      { name: 'Matematika', icon: Calculator, color: 'bg-indigo-100 text-indigo-700', students: 24, avg: 6.4 },
      { name: 'Ingelesa', icon: Languages, color: 'bg-purple-100 text-purple-700', students: 24, avg: 8.1 },
    ];

    return (
        <div className="animate-in fade-in duration-500 pb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    Nire Ikasgaiak
                </h2>
                <p className="text-slate-500 text-sm mt-1">Aukeratu kudeatu nahi duzun irakasgaia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {subjects.map((subject) => (
                    <div 
                        key={subject.name} 
                        onClick={() => {
                            setSelectedSubject(subject.name);
                            // Default category reset
                            if (subject.name === 'Matematika') {
                                setActiveCategory('kalkulu_mentala');
                            } else {
                                setActiveCategory('ulermena');
                            }
                        }}
                        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative hover:border-indigo-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${subject.color} group-hover:scale-110 transition-transform`}>
                                <subject.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                LH 5. Maila
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-1">{subject.name}</h4>
                        <div className="flex justify-between items-center text-sm text-slate-500 mt-4">
                            <span>{subject.students} ikasle</span>
                            <span>B.B: <strong className="text-slate-700">{subject.avg}</strong></span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Exercise Bank Section */}
            {renderExerciseBankBuilder()}
        </div>
    );
  };

  const renderStudentsView = () => {
    if (selectedStudentId) {
       const student = selectedClass.students.find(s => s.id === selectedStudentId);
       if (!student) return null;

       // Mock data for student charts
       const studentSubjects = ['Matematika', 'Euskara', 'Ingelesa', 'Ingurunea', 'Gaztelera'];
       const performanceData = [
          { name: '1. Eb', classAvg: 6.5, target: 7 },
          { name: 'Zatikiak', classAvg: 7.2, target: 7 },
          { name: 'Problemak', classAvg: 5.8, target: 7 },
          { name: 'Kalkulua', classAvg: 8.1, target: 7 },
          { name: 'Geometria', classAvg: 7.5, target: 7 },
       ];
       const distributionData = [
          { name: '0-4', value: 3, color: '#f43f5e' },
          { name: '5-6', value: 8, color: '#f59e0b' },
          { name: '7-8', value: 10, color: '#3b82f6' },
          { name: '9-10', value: 4, color: '#10b981' },
       ];
       const skillsData = [
          { name: 'Arrazoiketa', score: 65 },
          { name: 'Kalkulua', score: 85 },
          { name: 'Kontzeptuak', score: 70 },
          { name: 'Jarrera', score: 90 },
       ];
       
       // Mock Data for Sociogram
       const sociogramData = [
         { date: 'Iraila', score: 6.5 },
         { date: 'Urria', score: 7.0 },
         { date: 'Azaroa', score: 7.8 },
         { date: 'Abendua', score: 8.2 },
         { date: 'Urtarrila', score: 8.0 },
       ];

       return (
         <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button 
              onClick={() => {
                setSelectedStudentId(null);
                setStudentViewMode('general');
              }}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Ikasleen zerrendara itzuli
            </button>

            {/* Student Header Card - Always Visible */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between mb-8">
               <div className="flex items-center gap-6">
                    <img 
                      src={student.photoUrl} 
                      className="w-20 h-20 rounded-full border-4 border-slate-50 object-cover shadow-sm" 
                    />
                    <div>
                       <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                       <div className="flex gap-4 mt-2 text-sm text-slate-500">
                           <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> LH 5. Maila</span>
                           <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Taldea: A</span>
                       </div>
                    </div>
               </div>
               
               <div className="flex gap-3">
                   <button 
                      onClick={() => setStudentViewMode('general')}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2
                         ${studentViewMode === 'general' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                      `}
                   >
                       <Layout className="w-4 h-4" />
                       Orokorra
                   </button>
                   <button 
                      onClick={() => setStudentViewMode('subjects')}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2
                         ${studentViewMode === 'subjects' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                      `}
                   >
                       <Table className="w-4 h-4" />
                       Kalifikazioak
                   </button>
                   <button 
                      onClick={() => setStudentViewMode('sociogram')}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2
                         ${studentViewMode === 'sociogram' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                      `}
                   >
                       <Network className="w-4 h-4" />
                       Soziograma
                   </button>
               </div>
            </div>

            {studentViewMode === 'general' ? (
                // --- GENERAL VIEW (Charts + Notes) ---
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                   <div className="xl:col-span-1 space-y-6">
                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            AI Irakasle Laguntzailea
                          </h3>
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                             <textarea 
                                value={teacherNote}
                                onChange={(e) => setTeacherNote(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-sm text-slate-600 focus:ring-0 resize-none h-32 leading-relaxed"
                                placeholder="Idatzi oharrak hemen..."
                             />
                          </div>
                          <button 
                            onClick={generateReport}
                            disabled={isAiGenerating}
                            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                          >
                             {isAiGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                             Txostena Sortu
                          </button>
                      </div>
                   </div>

                   <div className="xl:col-span-2 space-y-6">
                       <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                             <h3 className="font-bold text-slate-800">Bilakaera Akademikoa</h3>
                             <select className="text-sm bg-slate-50 border-slate-200 rounded-lg px-3 py-1">
                                <option>Ikasturte osoa</option>
                                <option>1. Hiruhilekoa</option>
                             </select>
                          </div>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={MOCK_STUDENT_STATS.evolution}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                      <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                      <Line type="monotone" dataKey="grade" stroke="#6366f1" strokeWidth={4} dot={{r: 4, strokeWidth: 0, fill: '#6366f1'}} activeDot={{r: 6, strokeWidth: 0}} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                                  Indarguneak
                               </h3>
                               <div className="flex flex-wrap gap-2">
                                  {MOCK_STUDENT_STATS.strengths.map((s, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                                       {s}
                                    </span>
                                  ))}
                               </div>
                           </div>
                           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-rose-500" />
                                  Hobetzekoak
                               </h3>
                               <div className="flex flex-wrap gap-2">
                                  {MOCK_STUDENT_STATS.weaknesses.map((s, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100">
                                       {s}
                                    </span>
                                  ))}
                               </div>
                           </div>
                       </div>
                   </div>
                </div>
            ) : studentViewMode === 'sociogram' ? (
                // --- SOCIOGRAM VIEW ---
                <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
                   <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                       <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-purple-100 rounded-lg">
                             <Network className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-slate-800">Integrazio Soziala</h3>
                              <p className="text-sm text-slate-500">Soziogramen emaitzen bilakaera ikasturtean zehar.</p>
                          </div>
                       </div>

                       <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={sociogramData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                  <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                                    itemStyle={{color: '#9333ea', fontWeight: 'bold'}}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    name="Integrazioa"
                                    stroke="#9333ea" 
                                    strokeWidth={4} 
                                    dot={{r: 6, strokeWidth: 2, fill: '#fff', stroke: '#9333ea'}} 
                                    activeDot={{r: 8, strokeWidth: 0, fill: '#9333ea'}} 
                                  />
                              </LineChart>
                          </ResponsiveContainer>
                       </div>
                       
                       <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3">
                           <Activity className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-purple-900 leading-relaxed">
                               <strong>Analisi Laburra:</strong> Ikaslearen integrazio maila nabarmen hobetu da azken hiruhilekoan. Talde dinamiketan parte hartze aktiboagoa erakusten du eta ikaskideekiko harremanak sendotu ditu.
                           </p>
                       </div>
                   </div>
                </div>
            ) : (
                // --- GRADEBOOK / SUBJECTS VIEW (Restored) ---
                <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
                    {/* Subject Selector Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {studentSubjects.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSelectedStudentSubject(sub)}
                                className={`p-3 rounded-xl border text-center transition-all
                                    ${selectedStudentSubject === sub 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'}
                                `}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>

                     {/* 1. ROW: KPI CARDS */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Gelako Batez Bestekoa</p>
                           <div className="flex items-end gap-2">
                              <span className="text-3xl font-bold text-indigo-600">7.8</span>
                              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-1 rounded mb-1">▲ 0.3</span>
                           </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Onartuen Tasa</p>
                           <div className="flex items-end gap-2">
                              <span className="text-3xl font-bold text-emerald-600">88%</span>
                              <span className="text-xs text-slate-400 mb-1">21/24 Ikasle</span>
                           </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Zailtasun Handiena</p>
                           <div className="flex items-end gap-2">
                              <span className="text-xl font-bold text-rose-600">Problemak</span>
                              <span className="text-xs text-slate-400 mb-1">BB: 5.8</span>
                           </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Hurrengo Froga</p>
                           <div className="flex items-end gap-2">
                              <span className="text-xl font-bold text-slate-700">Ostirala</span>
                              <span className="text-xs text-slate-400 mb-1">Geometria</span>
                           </div>
                        </div>
                     </div>

                     {/* 2. ROW: CHARTS */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Chart A: Performance Trend */}
                        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-indigo-500" />
                              Emaitzen Eboluzioa (Gela vs Helburua)
                           </h3>
                           <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={performanceData}>
                                    <defs>
                                       <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 10]} tick={{fontSize: 12, fill: '#64748b'}} />
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    <Area type="monotone" dataKey="classAvg" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" name="Gela BB" />
                                    <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Helburua" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>

                        {/* Chart B: Distribution & Skills */}
                        <div className="flex flex-col gap-4">
                            {/* Distribution Pie */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                               <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                  <PieChartIcon className="w-5 h-5 text-indigo-500" />
                                  Nota Banaketa
                               </h3>
                               <div className="h-40 flex items-center justify-center">
                                  <ResponsiveContainer width="100%" height="100%">
                                     <PieChart>
                                        <Pie 
                                           data={distributionData} 
                                           innerRadius={40} 
                                           outerRadius={60} 
                                           paddingAngle={5} 
                                           dataKey="value"
                                        >
                                           {distributionData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                           ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                                     </PieChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>
                            
                            {/* Skills Progress */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col justify-center">
                                 <h3 className="font-bold text-slate-800 mb-3 text-sm">Gaitasunen Garapena</h3>
                                 <div className="space-y-3">
                                    {skillsData.map(skill => (
                                       <div key={skill.name}>
                                          <div className="flex justify-between text-xs mb-1">
                                             <span className="text-slate-600 font-medium">{skill.name}</span>
                                             <span className="text-slate-800 font-bold">{skill.score}%</span>
                                          </div>
                                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                             <div className="h-full bg-indigo-500 rounded-full" style={{width: `${skill.score}%`}}></div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                            </div>
                        </div>
                     </div>

                     {/* 3. ROW: THE GRADEBOOK TABLE */}
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                       <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                         <div className="flex items-center gap-3">
                            <Table className="w-5 h-5 text-indigo-600" />
                            <div>
                                <h3 className="font-bold text-slate-800">{selectedStudentSubject} - Kalifikazio Liburua</h3>
                                <p className="text-xs text-slate-500">Ikasle guztien notak</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button className="text-xs bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-medium text-slate-600 transition-colors">
                               Esportatu CSV
                            </button>
                            <button 
                                onClick={handleAddAssignment}
                                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-3 h-3" />
                                Gehitu Zutabea
                            </button>
                         </div>
                       </div>

                       <div className="overflow-auto flex-1">
                         <table className="w-full text-sm text-left relative border-collapse">
                           <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
                             <tr>
                               <th className="px-6 py-4 sticky left-0 bg-slate-50 z-30 border-r border-slate-200 border-b min-w-[200px]">Ikaslea</th>
                               {assignments.map(assign => (
                                 <th key={assign.id} className="px-4 py-3 min-w-[120px] border-b border-slate-200 text-center">
                                   <div className="flex flex-col items-center">
                                     <span className="font-bold">{assign.title}</span>
                                     <span className="text-[10px] text-slate-400 font-normal">{assign.date}</span>
                                   </div>
                                 </th>
                               ))}
                               <th className="px-6 py-4 bg-indigo-50 text-indigo-700 text-center sticky right-0 border-l border-indigo-100 border-b z-20">Batez Bestekoa</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             {selectedClass.students.map((s) => {
                               // Generate deterministic fake grades for demo
                               const mockGrades = assignments.map((ex, i) => {
                                  const seed = s.name.length + ex.title.length + i;
                                  return Math.min(10, Math.max(4, (seed % 5) + 5 + Math.random()));
                               });
                               const avg = mockGrades.reduce((a,b)=>a+b,0) / mockGrades.length;
                               const isSelected = s.id === selectedStudentId;
                               
                               return (
                                 <tr key={s.id} className={`${isSelected ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                                   <td className={`px-6 py-3 font-medium text-slate-900 sticky left-0 z-10 border-r border-slate-100 flex items-center gap-3 ${isSelected ? 'bg-amber-50' : 'bg-white group-hover:bg-slate-50'}`}>
                                      <div className={`w-1 h-8 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-transparent'}`}></div>
                                      <img src={s.photoUrl || `https://ui-avatars.com/api/?name=${s.name}`} className="w-8 h-8 rounded-full border border-slate-200" />
                                      {s.name}
                                   </td>
                                   {mockGrades.map((grade, i) => (
                                     <td key={i} className="px-4 py-3 text-center border-r border-slate-50">
                                       <input 
                                         type="number" 
                                         defaultValue={grade.toFixed(1)}
                                         max={10} min={0}
                                         className={`w-14 px-1 py-1.5 rounded-lg border text-center font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all
                                           ${grade < 5 ? 'text-rose-600 border-rose-200 bg-rose-50' : 'text-slate-700 border-slate-200 bg-white'}
                                         `}
                                       />
                                     </td>
                                   ))}
                                   <td className={`px-6 py-3 text-center sticky right-0 border-l border-indigo-100 ${isSelected ? 'bg-amber-50' : 'bg-indigo-50/30'}`}>
                                     <span className={`font-bold px-3 py-1 rounded-lg text-xs
                                       ${avg >= 5 ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'}
                                     `}>
                                       {avg.toFixed(1)}
                                     </span>
                                   </td>
                                 </tr>
                               );
                             })}
                           </tbody>
                         </table>
                       </div>
                     </div>
                </div>
            )}
         </div>
       );
    }

    return (
      <div className="animate-in fade-in duration-500">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              Ikasleen Zerrenda
            </h2>
            <div className="flex gap-2">
               <button 
                  onClick={() => alert("Soziograma bidalia ikasle guztiei!")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-indigo-700 flex items-center gap-2"
               >
                  <Network className="w-4 h-4" />
                  Soziograma Berria
               </button>
               <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                  <Layout className="w-5 h-5" />
               </button>
               <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                  <List className="w-5 h-5" />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {selectedClass.students.map((student) => (
               <div 
                 key={student.id} 
                 onClick={() => setSelectedStudentId(student.id)}
                 className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group flex flex-col items-center text-center relative"
               >
                  <div className="absolute top-4 right-4">
                     <div className={`w-2.5 h-2.5 rounded-full ${student.status === 'present' ? 'bg-emerald-500' : student.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                  </div>
                  
                  <img 
                    src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name}`} 
                    className="w-24 h-24 rounded-full mb-4 border-4 border-slate-50 group-hover:scale-105 transition-transform object-cover" 
                  />
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{student.name}</h3>
                  <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full mb-4">
                     LH 5. Maila
                  </p>

                  <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                     <div className="bg-slate-50 rounded-lg p-2">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Nota</span>
                        <span className="font-bold text-indigo-600">7.5</span>
                     </div>
                     <div className="bg-slate-50 rounded-lg p-2">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Ariketak</span>
                        <span className="font-bold text-indigo-600">85%</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col h-full ml-64 transition-all duration-300">
        <Header 
          classes={MOCK_CLASSES} 
          selectedClassId={selectedClassId} 
          onSelectClass={setSelectedClassId} 
          title={getViewTitle()}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {currentView === 'dashboard' && (
              <div className="grid grid-cols-12 gap-6 pb-8">
                 <div className="col-span-12 xl:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-40">
                       <div className="col-span-1 h-40">
                         <StatsCard grade={selectedClass.averageGrade} />
                       </div>
                       <div className="col-span-1 md:col-span-2 h-40">
                          <ScheduleWidget schedule={TODAY_SCHEDULE} />
                       </div>
                    </div>
                    <div className="h-[500px]">
                        <AttendanceWidget students={selectedClass.students} />
                    </div>
                 </div>
                 <div className="col-span-12 xl:col-span-4 h-full min-h-[500px]">
                     <AgendaWidget tasks={INITIAL_TASKS} />
                 </div>
              </div>
            )}

            {currentView === 'subjects' && renderSubjectsSection()}
            
            {currentView === 'calendar' && renderCalendarView()}
            
            {currentView === 'meetings' && renderMeetingsView()}
            
            {currentView === 'students' && renderStudentsView()}
            
            {currentView === 'settings' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                <Settings className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-slate-500">Ezarpenak</h3>
                <p className="text-sm">Atal hau garatzen ari da...</p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;