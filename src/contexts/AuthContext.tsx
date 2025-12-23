import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, USERS } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('unievent_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('unievent_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if it's an admin login attempt
    const isAdminEmail = normalizedEmail === 'talha@admin.com';
    
    // Check if it's a student email
    const isStudentEmail = normalizedEmail.endsWith('@student.ntu.edu.pk');
    
    if (!isAdminEmail && !isStudentEmail) {
      return { 
        success: false, 
        error: 'Invalid NTU email. Please use your NTU student email (@student.ntu.edu.pk) or admin credentials.' 
      };
    }

    // Find user
    const foundUser = USERS.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!foundUser) {
      return { 
        success: false, 
        error: 'Invalid login credentials. Please check your email and password.' 
      };
    }

    setUser(foundUser);
    localStorage.setItem('unievent_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unievent_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
