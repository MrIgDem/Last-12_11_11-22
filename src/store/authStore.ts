import { create } from 'zustand';
import { User, AuthState } from '../types/auth';

// Initialize users in localStorage with admin user
const adminUser: User = {
  id: '1',
  username: 'admin',
  name: 'Администратор',
  role: 'director',
  accessLevel: 'admin',
  email: 'admin@example.com',
  phone: '+7 (999) 999-99-99',
  department: 'management',
  position: 'Директор',
  password: 'admin123',
  createdAt: new Date().toISOString()
};

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([adminUser]));
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      
      const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() || 
        u.email.toLowerCase() === username.toLowerCase()
      );

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      if (user.password !== password) {
        throw new Error('Неверный пароль');
      }

      const { password: _, ...userWithoutPassword } = user;

      set({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      
      const existingUser = users.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase() ||
        u.username.toLowerCase() === userData.username.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('Пользователь с таким email или именем уже существует');
      }

      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }
}));