import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { TaskList } from '../../components/tasks/TaskList';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { BrowserRouter } from 'react-router-dom';

describe('Task Store and Components', () => {
  beforeEach(() => {
    const taskStore = useTaskStore.getState();
    const authStore = useAuthStore.getState();
    
    // Reset stores
    taskStore.tasks = [];
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

  test('should render task list', () => {
    const tasks = [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'Description 1',
        status: 'new' as const,
        priority: 'high' as const,
        assignee: 'Engineer 1',
        project: 'PROJ-001',
        projectName: 'Project 1',
        deadline: '2024-12-31',
        type: 'rd' as const,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: 'Description 2',
        status: 'in_progress' as const,
        priority: 'medium' as const,
        assignee: 'Engineer 2',
        project: 'PROJ-002',
        projectName: 'Project 2',
        deadline: '2024-12-31',
        type: 'rd' as const,
        createdAt: new Date().toISOString()
      }
    ];

    const handleStatusChange = vi.fn();
    const handleTaskClick = vi.fn();

    render(
      <BrowserRouter>
        <TaskList 
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={handleTaskClick}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  test('should render task creation modal', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateTaskModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Создание новой задачи')).toBeInTheDocument();
    expect(screen.getByLabelText('Название задачи')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
  });

  test('should handle task form submission', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateTaskModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText('Название задачи');
    const descriptionInput = screen.getByLabelText('Описание');
    const submitButton = screen.getByRole('button', { name: /создать/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  test('should validate required fields in task form', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateTaskModal
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

  test('should close task modal on cancel', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <CreateTaskModal
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