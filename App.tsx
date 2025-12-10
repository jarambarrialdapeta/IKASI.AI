import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import ScheduleWidget from './components/ScheduleWidget';
import AgendaWidget from './components/AgendaWidget';
import AttendanceWidget from './components/AttendanceWidget';
import { MOCK_CLASSES, TODAY_SCHEDULE, INITIAL_TASKS, MOCK_STUDENT_STATS } from './constants';
import { Exercise } from './types';
import { 
  BookOpen, Calendar, Users, Settings, Database, Calculator, 
  Globe, Languages, Book, HardDrive, ArrowLeft, Ear, PenTool, 
  BookType, WholeWord, Plus, FileText, Send, MoreVertical, X,
  Upload, List, HelpCircle, CheckSquare, Sparkles, Brain, Sigma, Puzzle,
  TrendingUp, AlertCircle, Clock, Save, FileDown, Search, BarChart3, Layout
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const App: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string>(MOCK_CLASSES[0].id);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  // Navigation State for Subjects
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ulermena');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Student Detail State
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentViewMode, setStudentViewMode] = useState<'general' | 'subjects'>('general');
  const [selectedStudentSubject, setSelectedStudentSubject] = useState<string>('Matematika');
  const [teacherNote, setTeacherNote] = useState(MOCK_STUDENT_STATS.teacherNotes);

  // Mock Exercises Data
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', title: 'Ipuinaren ulermena: "Basoko Misterioa"', description: 'Fitxategia aztertuta - 5 Galdera', category: 'ulermena', status: 'published', date: '2023-10-24' },
    { id: '2', title: 'Aditz laguntzailea: NOR-NORI-NORK', description: 'Bete hutsuneak taulan.', category: 'gramatika', status: 'published', date: '2023-10-22' },
    { id: '3', title: 'Sinonimoak eta Antonimoak', description: 'Lotu hitzak bere bikotearekin.', category: 'lexikoa', status: 'draft', date: '2023-10-25' },
    { id: '4', title: 'Biderketa taulak errepasatzen', description: '3, 4 eta 6ko taulak', category: 'aritmetika', status: 'published', date: '2023-10-26' },
  ]);

  const selectedClass = MOCK_CLASSES.find(c => c.id === selectedClassId) || MOCK_CLASSES[0];

  const getViewTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Arbela';
      case 'subjects': return selectedSubject ? selectedSubject : 'Ikasgaiak';
      case 'students': return 'Ikasleen Jarraipena';
      case 'calendar': return 'Egutegia';
      case 'settings': return 'Ezarpenak';
      default: return 'Arbela';
    }
  };

  // Helper function for localization
  const getLocalizedLabels = (subject: string | null) => {
    if (subject === 'Gaztelera') {
      return {
        createTitle: 'Generador de Ejercicios',
        subtitle: 'Sube un archivo para generar un cuestionario automáticamente.',
        upload: 'Haz clic o arrastra el archivo',
        titleLabel: 'Título',
        qCount: 'Preguntas',
        qType: 'Tipo de Test',
        types: { multiple: 'Opción Múltiple', boolean: 'Verdadero / Falso', open: 'Respuesta Abierta' },
        createBtn: 'Crear Cuestionario',
        exerciseTitlePlaceholder: 'Título del Ejercicio',
        listTitle: 'Ejercicios Disponibles',
        emptyState: 'No hay ejercicios todavía.',
        viewBtn: 'Ver',
        draft: 'Borrador',
        published: 'Publicado'
      };
    }
    if (subject === 'Ingelesa') {
      return {
        createTitle: 'Exercise Generator',
        subtitle: 'Upload a file to automatically generate a quiz.',
        upload: 'Click or drag file',
        titleLabel: 'Title',
        qCount: 'Questions',
        qType: 'Quiz Type',
        types: { multiple: 'Multiple Choice', boolean: 'True / False', open: 'Open Answer' },
        createBtn: 'Create Quiz',
        exerciseTitlePlaceholder: 'Exercise Title',
        listTitle: 'Available Exercises',
        emptyState: 'No exercises yet.',
        viewBtn: 'View',
        draft: 'Draft',
        published: 'Sent'
      };
    }
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

  // Helper to generate random subject evolution data
  const getSubjectEvolutionData = (subject: string) => {
    // Generate deterministic random-ish data based on subject name length
    const base = subject === 'Matematika' ? 6.5 : subject === 'Euskara' ? 7.5 : 7.0;
    const offset = subject.length % 3; 
    
    return [
      { month: 'Ira', grade: Math.min(10, Math.max(0, base - 0.5 + (offset * 0.1))) },
      { month: 'Urr', grade: Math.min(10, Math.max(0, base + 0.2 - (offset * 0.2))) },
      { month: 'Aza', grade: Math.min(10, Math.max(0, base + 0.0 + (offset * 0.1))) },
      { month: 'Abe', grade: Math.min(10, Math.max(0, base + 0.8 - (offset * 0.1))) },
      { month: 'Urt', grade: Math.min(10, Math.max(0, base + 0.5 + (offset * 0.2))) },
      { month: 'Ots', grade: Math.min(10, Math.max(0, base + 1.2 - (offset * 0.1))) },
    ];
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
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <SubjectIcon className="w-6 h-6 text-indigo-600" />
                {selectedSubject}
            </h2>
            <p className="text-slate-500 text-sm">LH 5. Maila • 24 Ikasle</p>
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

        {/* New Subject Statistics Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Batez Bestekoa</p>
                    <p className="text-2xl font-bold text-slate-800">7.8</p>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Egindako Ariketak</p>
                    <p className="text-2xl font-bold text-slate-800">84%</p>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckSquare className="w-5 h-5" />
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Zuzentzeke</p>
                    <p className="text-2xl font-bold text-slate-800">5</p>
                </div>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock className="w-5 h-5" />
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Ahulgune Nagusia</p>
                    <p className="text-sm font-bold text-slate-800">Aditzak</p>
                </div>
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                </div>
            </div>
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

        {/* UNIFIED VIEW FOR ULERMENA */}
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
      </div>
    );
  };

  const renderStudentsView = () => {
    // Sort students alphabetically by surname
    const sortedStudents = [...selectedClass.students].sort((a, b) => {
        const surnameA = a.name.split(' ').slice(-1)[0];
        const surnameB = b.name.split(' ').slice(-1)[0];
        return surnameA.localeCompare(surnameB);
    });

    const activeStudent = selectedStudentId 
        ? sortedStudents.find(s => s.id === selectedStudentId) 
        : sortedStudents[0];

    // Use Mock Data if the selected student
    const stats = activeStudent?.id === '1' ? MOCK_STUDENT_STATS : {
        ...MOCK_STUDENT_STATS, 
        name: activeStudent?.name || '', 
        photoUrl: activeStudent?.photoUrl,
        evolution: MOCK_STUDENT_STATS.evolution.map(e => ({...e, grade: Math.max(4, e.grade - Math.random() * 2)}))
    };

    const studentSubjects = ['Matematika', 'Euskara', 'Ingelesa', 'Ingurunea', 'Gaztelera'];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4">
            {/* Student List Sidebar */}
            <div className="lg:w-1/4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Bilatu ikaslea..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sortedStudents.map(student => (
                        <div 
                            key={student.id}
                            onClick={() => {
                                setSelectedStudentId(student.id);
                                setStudentViewMode('general'); // Reset to general when changing student
                            }}
                            className={`flex items-center gap-3 p-3 border-b border-slate-50 cursor-pointer transition-colors
                                ${activeStudent?.id === student.id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-slate-50'}
                            `}
                        >
                            <img 
                                src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name}&background=random`} 
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                                <p className={`text-sm font-bold ${activeStudent?.id === student.id ? 'text-indigo-800' : 'text-slate-700'}`}>
                                    {student.name}
                                </p>
                                <p className="text-xs text-slate-500">LH 5.A</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Profile Area */}
            <div className="lg:w-3/4 flex flex-col gap-6 overflow-y-auto pr-2">
                
                {/* Header Card with Navigation Toggle */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                    <div className="flex items-center gap-6">
                         <img 
                            src={stats.photoUrl || ""} 
                            alt={stats.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-sm"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{stats.name}</h2>
                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 2013/05/14</span>
                                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Taldea: A</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                         <button 
                            onClick={() => setStudentViewMode(studentViewMode === 'general' ? 'subjects' : 'general')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm
                                ${studentViewMode === 'subjects' 
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}
                            `}
                         >
                            {studentViewMode === 'general' ? (
                                <>
                                    <Layout className="w-4 h-4" />
                                    Ikasgaika
                                </>
                            ) : (
                                <>
                                    <ArrowLeft className="w-4 h-4" />
                                    Orokorra
                                </>
                            )}
                         </button>
                         <p className="text-3xl font-bold text-indigo-600">7.2 <span className="text-xs text-slate-400 font-normal uppercase tracking-wide">B.B.</span></p>
                    </div>
                </div>

                {/* Content based on Mode */}
                {studentViewMode === 'general' ? (
                    <>
                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Evolution Chart */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                    Bilakaera Akademikoa (Orokorra)
                                </h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats.evolution}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line type="monotone" dataKey="grade" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Puzzle className="w-5 h-5 text-indigo-500" />
                                    Gaitasun Analisia
                                </h3>
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="bg-rose-50 rounded-xl p-4">
                                        <h4 className="font-bold text-rose-700 mb-3 text-sm uppercase flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> Ahulguneak
                                        </h4>
                                        <ul className="space-y-2">
                                            {stats.weaknesses.map((w, i) => (
                                                <li key={i} className="text-sm text-rose-800 bg-white/50 px-2 py-1.5 rounded flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <h4 className="font-bold text-emerald-700 mb-3 text-sm uppercase flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4" /> Indarguneak
                                        </h4>
                                        <ul className="space-y-2">
                                            {stats.strengths.map((s, i) => (
                                                <li key={i} className="text-sm text-emerald-800 bg-white/50 px-2 py-1.5 rounded flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FULL WIDTH Report Section */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-[300px]">
                            <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-500" />
                                    Txosten Pedagogikoa
                                </h3>
                                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2">
                                    <FileDown className="w-4 h-4" />
                                    Sortu PDF
                                </button>
                            </div>
                            
                            <div className="flex-1 flex flex-col gap-4">
                                    <textarea 
                                    className="w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none min-h-[150px]"
                                    placeholder="Idatzi irakaslearen oharrak hemen..."
                                    value={teacherNote}
                                    onChange={(e) => setTeacherNote(e.target.value)}
                                    ></textarea>

                                    <div className="flex gap-4">
                                        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                            <Upload className="w-6 h-6 text-slate-400 mb-2" />
                                            <p className="text-xs font-medium text-slate-600">Erantsi dokumentuak</p>
                                        </div>
                                        <button className="px-8 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Gorde
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // SUBJECTS VIEW
                    <div className="animate-in fade-in slide-in-from-right-4">
                        {/* Subject Selector Buttons */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
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

                        {/* Specific Subject Chart */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                                    {selectedStudentSubject} - Noten Eboluzioa
                                </h3>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold">
                                    Eguneratua: Gaur
                                </span>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={getSubjectEvolutionData(selectedStudentSubject)}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="grade" 
                                            stroke="#6366f1" 
                                            strokeWidth={4} 
                                            dot={{r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff'}} 
                                            activeDot={{r: 8}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Extra stats for subject (Optional filler) */}
                        <div className="grid grid-cols-3 gap-6 mt-6">
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Jarrera</p>
                                <p className="text-xl font-bold text-emerald-800">Oso Ona</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Etxeko Lanak</p>
                                <p className="text-xl font-bold text-blue-800">95%</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <p className="text-xs text-amber-600 font-bold uppercase mb-1">Azterketak</p>
                                <p className="text-xl font-bold text-amber-800">7.5</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
  };

  const renderSubjectsView = () => {
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
      <div className="space-y-10 animate-in fade-in duration-500">
        
        {/* Subjects Grid */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Nire Ikasgaiak
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div 
                key={subject.name} 
                onClick={() => {
                  if (['Euskara', 'Gaztelera', 'Ingelesa', 'Matematika'].includes(subject.name)) {
                    setSelectedSubject(subject.name);
                    // Reset to first category based on subject
                    if (subject.name === 'Matematika') {
                      setActiveCategory('kalkulu_mentala');
                    } else {
                      setActiveCategory('ulermena');
                    }
                  }
                }}
                className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative
                  ${['Euskara', 'Gaztelera', 'Ingelesa', 'Matematika'].includes(subject.name) ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                `}
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
                {['Euskara', 'Gaztelera', 'Ingelesa', 'Matematika'].includes(subject.name) && (
                  <div className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Database Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              Datu Basea
            </h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Kudeatu</button>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="p-2 bg-indigo-100 rounded text-indigo-600">
                        <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                        <h5 className="font-semibold text-slate-800">Baliabideak</h5>
                        <p className="text-xs text-slate-500">128 fitxategi</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="p-2 bg-emerald-100 rounded text-emerald-600">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h5 className="font-semibold text-slate-800">Ikasleen Fitxak</h5>
                        <p className="text-xs text-slate-500">24 erregistro</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="p-2 bg-amber-100 rounded text-amber-600">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h5 className="font-semibold text-slate-800">Programazioak</h5>
                        <p className="text-xs text-slate-500">2023-2024</p>
                    </div>
                </div>
             </div>
             <div className="bg-slate-50 border-t border-slate-200 px-6 py-3">
                <p className="text-xs text-slate-500 text-center">Azken eguneratzea: Gaur, 09:41</p>
             </div>
          </div>
        </div>

      </div>
    );
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

    if (currentView === 'subjects') {
        return renderSubjectsView();
    }

    if (currentView === 'students') {
        return renderStudentsView();
    }

    // Placeholder content for other views
    let Icon = BookOpen;
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
      <Sidebar currentView={currentView} onNavigate={(view) => {
        setCurrentView(view);
        setSelectedSubject(null); // Reset subject selection when changing main tabs
      }} />

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