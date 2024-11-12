import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../store/authStore';
import { LoginForm } from '../../components/auth/LoginForm';

describe('Auth Store and Components', () => {
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

  test('should render login form', () => {
    const handleLogin = vi.fn();
    render(<LoginForm onLogin={handleLogin} isLoading={false} />);
    
    expect(screen.getByLabelText(/email или имя пользователя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  test('should handle form submission', async () => {
    const handleLogin = vi.fn();
    render(<LoginForm onLogin={handleLogin} isLoading={false} />);
    
    const usernameInput = screen.getByLabelText(/email или имя пользователя/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  test('should show loading state', () => {
    render(<LoginForm onLogin={() => Promise.resolve()} isLoading={true} />);
    expect(screen.getByRole('button', { name: /вход\.\.\./i })).toBeInTheDocument();
  });

  test('should show error message', () => {
    const errorMessage = 'Неверные учетные данные';
    render(<LoginForm onLogin={() => Promise.resolve()} isLoading={false} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('should validate required fields', async () => {
    const handleLogin = vi.fn();
    render(<LoginForm onLogin={handleLogin} isLoading={false} />);
    
    const submitButton = screen.getByRole('button', { name: /войти/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/пожалуйста, заполните все поля/i)).toBeInTheDocument();
    });
    expect(handleLogin).not.toHaveBeenCalled();
  });

  test('should handle successful login flow', async () => {
    const store = useAuthStore.getState();
    const handleLogin = vi.fn().mockImplementation(store.login);
    
    await store.register({
      username: 'testuser',
      name: 'Test User',
      role: 'engineer',
      accessLevel: 'user',
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering',
      position: 'Engineer',
      password: 'password123'
    });

    render(<LoginForm onLogin={handleLogin} isLoading={false} />);
    
    const usernameInput = screen.getByLabelText(/email или имя пользователя/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });
});