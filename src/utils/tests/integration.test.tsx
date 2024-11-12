import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useDocumentStore } from '../../store/documentStore';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { TaskList } from '../../components/tasks/TaskList';
import { DocumentList } from '../../components/documents/DocumentList';

// Мокаем localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('System Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    
    // Создаем тестового пользователя
    const testUser = {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      role: 'director',
      accessLevel: 'admin',
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'management',
      position: 'Director',
      password: 'password123',
      createdAt: new Date().toISOString()
    };

    // Инициализируем хранилище пользователей
    mockLocalStorage.setItem('users', JSON.stringify([testUser]));

    // Сбрасываем состояние всех сторов
    const authStore = useAuthStore.getState();
    const projectStore = useProjectStore.getState();
    const taskStore = useTaskStore.getState();
    const documentStore = useDocumentStore.getState();

    authStore.logout();
    projectStore.projects = [];
    taskStore.tasks = [];
    documentStore.documents = [];
  });

  test('Complete project workflow', async () => {
    // 1. Авторизация пользователя
    const authStore = useAuthStore.getState();
    await authStore.login('testuser', 'password123');

    await waitFor(() => {
      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.user?.username).toBe('testuser');
    });

    // 2. Создание проекта
    const projectStore = useProjectStore.getState();
    const projectData = {
      customer: 'Test Customer',
      name: 'Test Project',
      deadline: '2024-12-31',
      priority: 'low' as const,
      surveyAct: false,
      code: 'TEST-001',
      assignee: 'Test Engineer',
      startDate: new Date().toISOString().split('T')[0],
      rdStatus: 'not_started' as const,
      idStatus: 'not_started' as const,
      toStatus: '',
      gipStatus: '',
      approvalStatus: '',
      customerDeliveryDate: '',
      notes: ''
    };

    projectStore.addProject(projectData);

    await waitFor(() => {
      expect(projectStore.projects.length).toBe(1);
    });

    // 3. Проверяем автоматическое создание задач для проекта
    const taskStore = useTaskStore.getState();
    const projectTasks = taskStore.getTasksByProject('TEST-001');
    
    expect(projectTasks.length).toBeGreaterThan(0);
    expect(projectTasks.some(task => task.type === 'rd')).toBe(true);
    expect(projectTasks.some(task => task.type === 'id')).toBe(true);

    // 4. Проверяем список задач
    render(
      <BrowserRouter>
        <TaskList
          tasks={projectTasks}
          onStatusChange={() => {}}
          onTaskClick={() => {}}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('TEST-001')).toBeInTheDocument();

    // 5. Создание документа
    const documentStore = useDocumentStore.getState();
    const docData = {
      type: 'RD' as const,
      code: 'TEST-001-RD',
      name: 'Рабочая документация',
      status: 'draft' as const,
      customer: 'Test Customer'
    };

    documentStore.addDocument(docData);

    await waitFor(() => {
      expect(documentStore.documents.length).toBe(1);
    });

    // 6. Проверяем статусы и связи
    const project = projectStore.projects[0];
    const document = documentStore.documents[0];
    const relatedTasks = taskStore.getTasksByProject(project.id);

    expect(document.code.includes(project.code)).toBe(true);
    expect(relatedTasks.every(task => task.project === project.id)).toBe(true);

    // 7. Проверяем обновление статусов
    const task = relatedTasks[0];
    taskStore.updateTask(task.id, { status: 'completed' });
    
    await waitFor(() => {
      const updatedTask = taskStore.tasks.find(t => t.id === task.id);
      expect(updatedTask?.status).toBe('completed');
    });
  });

  test('Document workflow', async () => {
    // 1. Авторизация
    const authStore = useAuthStore.getState();
    await authStore.login('testuser', 'password123');

    await waitFor(() => {
      expect(authStore.isAuthenticated).toBe(true);
    });

    // 2. Создание документа
    const documentStore = useDocumentStore.getState();
    const docData = {
      type: 'RD' as const,
      code: 'TEST-002-RD',
      name: 'Тестовый документ РД',
      status: 'draft' as const,
      customer: 'Test Customer'
    };

    documentStore.addDocument(docData);

    await waitFor(() => {
      expect(documentStore.documents.length).toBe(1);
    });

    // 3. Проверка статусов документа
    const doc = documentStore.documents[0];
    expect(doc.status).toBe('draft');

    documentStore.updateDocument(doc.id, { status: 'review' });
    
    await waitFor(() => {
      const updatedDoc = documentStore.documents.find(d => d.id === doc.id);
      expect(updatedDoc?.status).toBe('review');
    });
  });

  test('Task management workflow', async () => {
    // 1. Авторизация
    const authStore = useAuthStore.getState();
    await authStore.login('testuser', 'password123');

    await waitFor(() => {
      expect(authStore.isAuthenticated).toBe(true);
    });

    // 2. Создание задачи
    const taskStore = useTaskStore.getState();
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'new' as const,
      priority: 'high' as const,
      assignee: 'Test Engineer',
      project: 'TEST-003',
      projectName: 'Test Project',
      deadline: '2024-12-31',
      type: 'rd' as const
    };

    taskStore.addTask(taskData);

    await waitFor(() => {
      expect(taskStore.tasks.length).toBe(1);
    });

    // 3. Проверка назначения задачи
    const task = taskStore.tasks[0];
    expect(task.assignee).toBe('Test Engineer');

    // 4. Проверка обновления статуса
    taskStore.updateTask(task.id, { status: 'in_progress' });
    
    await waitFor(() => {
      const updatedTask = taskStore.tasks.find(t => t.id === task.id);
      expect(updatedTask?.status).toBe('in_progress');
    });

    // 5. Проверка фильтрации задач
    const highPriorityTasks = taskStore.tasks.filter(t => t.priority === 'high');
    expect(highPriorityTasks.length).toBe(1);

    const inProgressTasks = taskStore.getTasksByStatus('in_progress');
    expect(inProgressTasks.length).toBe(1);
  });

  test('Error handling', async () => {
    // 1. Проверка авторизации с неверными данными
    const authStore = useAuthStore.getState();
    await expect(
      authStore.login('wrong', 'credentials')
    ).rejects.toThrow();

    // 2. Проверка создания задачи без авторизации
    const taskStore = useTaskStore.getState();
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'new' as const,
      priority: 'high' as const,
      assignee: 'Test Engineer',
      project: 'TEST-004',
      projectName: 'Test Project',
      deadline: '2024-12-31',
      type: 'rd' as const
    };

    const initialTaskCount = taskStore.tasks.length;
    taskStore.addTask(taskData);
    expect(taskStore.tasks.length).toBe(initialTaskCount);

    // 3. Проверка доступа к документам без авторизации
    const documentStore = useDocumentStore.getState();
    const docData = {
      type: 'RD' as const,
      code: 'TEST-004-RD',
      name: 'Тестовый документ РД',
      status: 'draft' as const,
      customer: 'Test Customer'
    };

    documentStore.addDocument(docData);
    
    // Пытаемся получить документы без авторизации
    authStore.logout();
    const documents = documentStore.documents.filter(d => 
      d.type === 'RD' && d.status === 'draft'
    );
    expect(documents.length).toBe(0);
  });
});