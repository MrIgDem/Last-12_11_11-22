import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string>();

  const handleLogin = async (username: string, password: string) => {
    try {
      setError(undefined);
      await login(username, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      console.error('Login error:', errorMessage);
    }
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
}