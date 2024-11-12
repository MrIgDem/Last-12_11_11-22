import { describe, test, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';

describe('Project Store', () => {
  beforeEach(() => {
    const projectStore = useProjectStore.getState();
    const authStore = useAuthStore.getState();
    
    // Reset stores
    projectStore.projects = [];
    authStore.logout();
  });

  test('should add new project for authenticated user', async () => {
    const projectStore = useProjectStore.getState();
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

    const projectData = {
      type: 'b2b' as const,
      customer: 'Test Customer',
      name: 'Test Project',
      deadline: '2024-12-31',
      priority: 'low' as const,
      surveyAct: false,
      code: 'TEST-001',
      assignee: 'Test Engineer',
      startDate: '2024-01-01',
      rdStatus: 'not_started' as const,
      idStatus: 'not_started' as const,
      toStatus: '',
      gipStatus: '',
      approvalStatus: '',
      customerDeliveryDate: '',
      notes: ''
    };

    projectStore.addProject(projectData);
    expect(projectStore.projects).toHaveLength(1);
    expect(projectStore.projects[0].name).toBe(projectData.name);
  });

  test('should not add project for unauthenticated user', () => {
    const projectStore = useProjectStore.getState();
    
    const projectData = {
      type: 'b2b' as const,
      customer: 'Test Customer',
      name: 'Test Project',
      deadline: '2024-12-31',
      priority: 'low' as const,
      surveyAct: false,
      code: 'TEST-001',
      assignee: 'Test Engineer',
      startDate: '2024-01-01',
      rdStatus: 'not_started' as const,
      idStatus: 'not_started' as const,
      toStatus: '',
      gipStatus: '',
      approvalStatus: '',
      customerDeliveryDate: '',
      notes: ''
    };

    projectStore.addProject(projectData);
    expect(projectStore.projects).toHaveLength(0);
  });
});