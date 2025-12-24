export type UserRole = 'student' | 'admin';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: EventCategory;
  location: string;
  organizer: string;
  department?: string;
  image?: string;
  interestedCount: number;
  goingCount: number;
  status: 'active' | 'upcoming' | 'closed';
  createdAt: string;
  // User's own participation status (only visible to authenticated user)
  userInterested?: boolean;
  userGoing?: boolean;
}

export type EventCategory = 
  | 'Workshop'
  | 'Seminar'
  | 'Sports'
  | 'Cultural'
  | 'Technical'
  | 'Career'
  | 'Social'
  | 'Academic'
  | 'Competition';

export const INITIAL_CATEGORIES: EventCategory[] = [
  'Workshop',
  'Seminar',
  'Sports',
  'Cultural',
  'Technical',
  'Career',
  'Social',
  'Academic',
  'Competition'
];

export const INITIAL_DEPARTMENTS = [
  'Department of Computer Science',
  'Department of Textile Engineering',
  'FSD Business School',
  'Department of Fashion Design',
  'Department of Applied Sciences'
];

export const INITIAL_ORGANIZERS = [
  'AI Society',
  'Software Engineering Society',
  'Computer Science Society',
  'DCS Sports Society',
  'Literary Society',
  'Dramatics Society',
  'Music Society',
  'Photography Society',
  'E-Sports Society',
  'Career Services',
  'Cultural Society'
];

export const getCategoryColor = (category: EventCategory): string => {
  // Single consistent brown color for all categories
  return 'bg-amber-700 text-white border-amber-800';
};

export const isEventPast = (date: string): boolean => {
  return new Date(date) < new Date();
};

export const validateStudentEmail = (email: string): boolean => {
  return email.endsWith('@student.ntu.edu.pk');
};
