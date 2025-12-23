export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: EventCategory;
  location: string;
  organizer: string;
  image?: string;
  interestedCount: number;
  goingCount: number;
  interestedUsers: string[];
  goingUsers: string[];
  status: 'active' | 'closed';
  createdAt: string;
}

export type EventCategory = 
  | 'Workshop'
  | 'Seminar'
  | 'Sports'
  | 'Cultural'
  | 'Technical'
  | 'Career'
  | 'Social';

export const CATEGORIES: EventCategory[] = [
  'Workshop',
  'Seminar',
  'Sports',
  'Cultural',
  'Technical',
  'Career',
  'Social'
];

export const ORGANIZERS = [
  'Sports Department',
  'Coding Club',
  'Cultural Society',
  'Career Services',
  'IEEE NTU',
  'ACM Student Chapter',
  'Literary Society',
  'Textile Engineering Department',
  'Computer Science Department'
];

// Mock Users
export const USERS: User[] = [
  {
    id: '1',
    name: 'Mian Ali',
    email: '24ntucsfl1001@student.ntu.edu.pk',
    password: 'Ali12345',
    role: 'student'
  },
  {
    id: '2',
    name: 'Fatima Noor',
    email: '24ntucsfl1002@student.ntu.edu.pk',
    password: 'Fatima123',
    role: 'student'
  },
  {
    id: '3',
    name: 'Ahmed Ali',
    email: '24ntucsfl1003@student.ntu.edu.pk',
    password: 'Ahmed123',
    role: 'student'
  },
  {
    id: '4',
    name: 'Sara Khan',
    email: '24ntucsfl1004@student.ntu.edu.pk',
    password: 'Sara@2025',
    role: 'student'
  },
  {
    id: '5',
    name: 'Mian Talha',
    email: 'talha@admin.com',
    password: 'Admin123',
    role: 'admin'
  }
];

// Mock Events
export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Web Development Workshop',
    description: 'Learn modern web development with React, TypeScript, and Tailwind CSS. This hands-on workshop will cover everything from basics to advanced concepts.',
    date: '2025-01-15',
    time: '10:00 AM',
    category: 'Workshop',
    location: 'Computer Lab 1, CS Building',
    organizer: 'Coding Club',
    interestedCount: 45,
    goingCount: 28,
    interestedUsers: ['1', '2'],
    goingUsers: ['3'],
    status: 'active',
    createdAt: '2024-12-20'
  },
  {
    id: '2',
    title: 'Annual Sports Gala 2025',
    description: 'Join us for the biggest sports event of the year! Featuring cricket, football, basketball, and athletics competitions.',
    date: '2025-01-20',
    time: '9:00 AM',
    category: 'Sports',
    location: 'NTU Sports Complex',
    organizer: 'Sports Department',
    interestedCount: 120,
    goingCount: 85,
    interestedUsers: ['1', '3', '4'],
    goingUsers: ['2'],
    status: 'active',
    createdAt: '2024-12-18'
  },
  {
    id: '3',
    title: 'AI & Machine Learning Seminar',
    description: 'Industry experts will discuss the latest trends in AI and Machine Learning. Perfect for students interested in cutting-edge technology.',
    date: '2025-01-25',
    time: '2:00 PM',
    category: 'Seminar',
    location: 'Auditorium Hall',
    organizer: 'IEEE NTU',
    interestedCount: 78,
    goingCount: 52,
    interestedUsers: ['2', '4'],
    goingUsers: ['1', '3'],
    status: 'active',
    createdAt: '2024-12-15'
  },
  {
    id: '4',
    title: 'Cultural Night - Rang-e-Pakistan',
    description: 'Celebrate the diverse culture of Pakistan through music, dance, and traditional performances.',
    date: '2025-02-01',
    time: '6:00 PM',
    category: 'Cultural',
    location: 'Open Air Theatre',
    organizer: 'Cultural Society',
    interestedCount: 200,
    goingCount: 150,
    interestedUsers: ['1', '2', '3', '4'],
    goingUsers: [],
    status: 'active',
    createdAt: '2024-12-10'
  },
  {
    id: '5',
    title: 'Career Fair 2025',
    description: 'Meet top employers and explore career opportunities. Bring your CV and dress professionally!',
    date: '2025-02-10',
    time: '10:00 AM',
    category: 'Career',
    location: 'Main Campus Ground',
    organizer: 'Career Services',
    interestedCount: 300,
    goingCount: 220,
    interestedUsers: [],
    goingUsers: ['1', '2', '3', '4'],
    status: 'active',
    createdAt: '2024-12-05'
  },
  {
    id: '6',
    title: 'Hackathon 2024',
    description: '24-hour coding competition. Build innovative solutions and win exciting prizes!',
    date: '2024-12-01',
    time: '8:00 AM',
    category: 'Technical',
    location: 'CS Building',
    organizer: 'ACM Student Chapter',
    interestedCount: 150,
    goingCount: 100,
    interestedUsers: ['1', '2'],
    goingUsers: ['3', '4'],
    status: 'closed',
    createdAt: '2024-11-15'
  }
];

export const getCategoryColor = (category: EventCategory): string => {
  const colors: Record<EventCategory, string> = {
    Workshop: 'bg-info/10 text-info',
    Seminar: 'bg-primary/10 text-primary',
    Sports: 'bg-success/10 text-success',
    Cultural: 'bg-accent/20 text-accent-foreground',
    Technical: 'bg-secondary text-secondary-foreground',
    Career: 'bg-warning/10 text-warning-foreground',
    Social: 'bg-muted text-muted-foreground'
  };
  return colors[category];
};

export const isEventPast = (date: string): boolean => {
  return new Date(date) < new Date();
};

export const validateStudentEmail = (email: string): boolean => {
  return email.endsWith('@student.ntu.edu.pk');
};

export const validateAdminCredentials = (email: string, password: string): boolean => {
  const admin = USERS.find(u => u.role === 'admin');
  return admin?.email === email && admin?.password === password;
};
