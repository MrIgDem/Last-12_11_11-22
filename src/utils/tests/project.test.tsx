import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { BrowserRouter } from 'react-router-dom';

describe('Project Store and Components', () => {
  beforeEach(() => {
    const projectStore = useProjectStore.getState();
    const authStore = useAuthStore.getState();
    
    // Reset stores
    projectStore.projects = [];
    authStore.logout();

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

  test('should render project creation modal', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateProjectModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Создание нового проекта')).toBeInTheDocument();
    expect(screen.getByLabelText('Заказчик')).toBeInTheDocument();
    expect(screen.getByLabelText('Наименование объекта')).toBeInTheDocument();
  });

  test('should handle project form submission', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateProjectModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </BrowserRouter>
    );

    const customerInput = screen.getByLabelText('Заказчик');
    const nameInput = screen.getByLabelText('Наименование объекта');
    const codeInput = screen.getByLabelText('Шифр проекта');
    const submitButton = screen.getByRole('button', { name: /создать/i });

    fireEvent.change(customerInput, { target: { value: 'Test Customer' } });
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    fireEvent.change(codeInput, { target: { value: 'TEST-001' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  test('should validate required fields', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateProjectModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /создать/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  test('should close modal on cancel', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateProjectModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </BrowserRouter>
    );

    const cancelButton = screen.getByRole('button', { name: /отмена/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});