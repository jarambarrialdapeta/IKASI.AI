import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import ScheduleWidget from './components/ScheduleWidget';
import AgendaWidget from './components/AgendaWidget';
import AttendanceWidget from './components/AttendanceWidget';
import { MOCK_CLASSES, TODAY_SCHEDULE, INITIAL_TASKS } from './constants';
import { Exercise } from './types';
import { 
  BookOpen, Calendar, Users, Settings, Database, Calculator, 
  Globe, Languages, Book, HardDrive, ArrowLeft, Ear, PenTool, 
  BookType, WholeWord, Plus, FileText, Send, MoreVertical, X,
  Upload, List, HelpCircle, CheckSquare, Sparkles, Brain, Sigma, Puzzle
} from 'lucide-react';

const App: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string>(MOCK_CLASSES[0].id);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  // Navigation State for Subjects
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  // Changed type to string to allow Math categories
  const [activeCategory, setActiveCategory] = useState<string>('ulermena');
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      case 'students': return 'Ikasleak';
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

  const renderSubjectDetail = () => {
    let categories;

    if (selectedSubject === 'Matematika') {
      categories = [
        { id: 'kalkulu_mentala', label: 'Kalkulu Mentala', icon: Brain, color: 'text-pink-600 bg-pink-50' },
        { id: 'aritmetika', label: 'Aritmetika', icon: Sigma, color: 'text-blue-600 bg-blue-50' },
        { id: 'buruketak', label: 'Buruketak', icon: HelpCircle, color: 'text-amber-600 bg-amber-50' },
      ];
    } else {
      // Default Language Categories
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
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setSelectedSubject(null)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">{selectedSubject}</h2>
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

        {/* Modal for Creating Exercise (Used for Non-Ulermena or Non-Language subjects) */}
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