import { ClassGroup, ScheduleItem, TaskItem } from './types';

export const MOCK_CLASSES: ClassGroup[] = [
  {
    id: 'lh5a',
    name: 'LH 5.A - Matematika',
    averageGrade: 7.8,
    students: [
      { id: '1', name: 'Mikel Agirre', status: 'present' },
      { id: '2', name: 'Ane Etxebarria', status: 'present' },
      { id: '3', name: 'Jon Zabaleta', status: 'present' },
      { id: '4', name: 'Maite Ibarra', status: 'present' },
      { id: '5', name: 'Unai Goikoetxea', status: 'present' },
      { id: '6', name: 'Irati Otegi', status: 'present' },
      { id: '7', name: 'Oier Mendizabal', status: 'present' },
      { id: '8', name: 'Uxue Arriola', status: 'present' },
    ],
  },
  {
    id: 'lh5b',
    name: 'LH 5.B - Euskara',
    averageGrade: 6.9,
    students: [
      { id: '11', name: 'Iker Larrañaga', status: 'present' },
      { id: '12', name: 'Nerea Azurmendi', status: 'present' },
      { id: '13', name: 'Aitor Egiguren', status: 'present' },
      { id: '14', name: 'Leire Garmendia', status: 'present' },
    ],
  },
  {
    id: 'lh6a',
    name: 'LH 6.A - Tutoretza',
    averageGrade: 8.2,
    students: [
      { id: '21', name: 'Eneko Urrutia', status: 'present' },
      { id: '22', name: 'Haizea Bilbao', status: 'present' },
      { id: '23', name: 'Julen Elorza', status: 'present' },
      { id: '24', name: 'Amaia Uriarte', status: 'present' },
      { id: '25', name: 'Markel Zubizarreta', status: 'present' },
    ],
  },
];

export const TODAY_SCHEDULE: ScheduleItem[] = [
  { id: 's1', time: '09:00 - 10:00', subject: 'Matematika', room: '201 Gela', color: 'bg-blue-100 text-blue-800' },
  { id: 's2', time: '10:00 - 11:00', subject: 'Euskara', room: '201 Gela', color: 'bg-emerald-100 text-emerald-800' },
  { id: 's3', time: '11:30 - 12:30', subject: 'Ingelesa', room: 'Laborategia', color: 'bg-indigo-100 text-indigo-800' },
  { id: 's4', time: '14:30 - 15:30', subject: 'Gizarte', room: '201 Gela', color: 'bg-amber-100 text-amber-800' },
  { id: 's5', time: '15:30 - 16:30', subject: 'Tutoretza', room: 'Bulegoa', color: 'bg-slate-100 text-slate-800' },
];

export const INITIAL_TASKS: TaskItem[] = [
  { id: 't1', text: 'Etxeko lanak zuzendu (Zatikiak)', completed: false, category: 'work' },
  { id: 't2', text: 'Koordinazio bilera (12:30)', completed: true, category: 'coordination' },
  { id: 't3', text: 'Gabonetako dantza entsegua prestatu', completed: false, category: 'event' },
  { id: 't4', text: 'Kilo kanpainako oharra bidali gurasoei', completed: false, category: 'event' },
  { id: 't5', text: 'Mikel-en gurasoekin hitzordua', completed: false, category: 'coordination' },
];
