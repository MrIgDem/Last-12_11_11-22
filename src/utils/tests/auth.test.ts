import { describe, test, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear localStorage and reset store
    localStorage.clear();
    const store = useAuthStore.getState();
    store.logout();

    // Initialize with admin user
    const adminUser = {
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
    localStorage.setItem('users', JSON.stringify([adminUser]));
  });

  test('should register a new user', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    expect(users.length).toBeGreaterThan(1); // Учитываем админа
    expect(users.find(u => u.username === userData.username)).toBeTruthy();
  });

  test('should login user with correct credentials', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    await store.login('testuser', 'password123');
    
    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.username).toBe(userData.username);
  });

  test('should not login with incorrect password', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    
    await expect(store.login('testuser', 'wrongpassword')).rejects.toThrow('Неверный пароль');
  });

  test('should logout user', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    await store.login('testuser', 'password123');
    store.logout();
    
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });

  test('should not register duplicate users', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    await expect(store.register(userData)).rejects.toThrow('Пользователь с таким email или именем уже существует');
  });

  test('should login with email', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    await store.login('test@example.com', 'password123');
    
    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.email).toBe(userData.email);
  });
});