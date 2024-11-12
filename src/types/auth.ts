export type Role = 'director' | 'engineer' | 'installer' | 'manager' | 'contractor';
export type AccessLevel = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
  accessLevel: AccessLevel;
  email: string;
  phone: string;
  department: string;
  position: string;
  password?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
}