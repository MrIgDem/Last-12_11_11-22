import { describe, test, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';

describe('Task Store', () => {
  beforeEach(() => {
    const taskStore = useTaskStore.getState();
    const authStore = useAuthStore.getState();
    
    // Reset stores
    taskStore.tasks = [];
    authStore.logout();
  });

  test('should add new task for authenticated user', async () => {
    const taskStore = useTaskStore.getState();
    const authStore = useAuthStore.getState();

    // Register and login user
    await authStore.register({
      username: 'testuser',
      name: 'Test User',
      role: 'manager',
      accessLevel: 'manager',
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'management',
      position: 'Manager',
      password: 'password123'
    });
    await authStore.login('testuser', 'password123');

    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'new' as const,
      priority: 'medium' as const,
      assignee: 'Test Engineer',
      project: 'TEST-001',
      projectName: 'Test Project',
      deadline: '2024-12-31',
      type: 'rd' as const
    };

    taskStore.addTask(taskData);
    expect(taskStore.tasks).toHaveLength(1);
    expect(taskStore.tasks[0].title).toBe(taskData.title);
  });

  test('should not add task for unauthenticated user', () => {
    const taskStore = useTaskStore.getState();
    
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'new' as const,
      priority: 'medium' as const,
      assignee: 'Test Engineer',
      project: 'TEST-001',
      projectName: 'Test Project',
      deadline: '2024-12-31',
      type: 'rd' as const
    };

    taskStore.addTask(taskData);
    expect(taskStore.tasks).toHaveLength(0);
  });

  test('should update task status', async () => {
    const taskStore = useTaskStore.getState();
    const authStore = useAuthStore.getState();

    // Register and login user
    await authStore.register({
      username: 'testuser',
      name: 'Test User',
      role: 'manager',
      accessLevel: 'manager',
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'management',
      position: 'Manager',
      password: 'password123'
    });
    await authStore.login('testuser', 'password123');

    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'new' as const,
      priority: 'medium' as const,
      assignee: 'Test Engineer',
      project: 'TEST-001',
      projectName: 'Test Project',
      deadline: '2024-12-31',
      type: 'rd' as const
    };

    taskStore.addTask(taskData);
    const task = taskStore.tasks[0];
    
    taskStore.updateTask(task.id, { status: 'in_progress' });
    expect(taskStore.tasks[0].status).toBe('in_progress');
  });
});