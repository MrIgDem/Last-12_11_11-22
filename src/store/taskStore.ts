import { create } from 'zustand';
import { TaskStore, Task } from '../types/task';
import { useAuthStore } from './authStore';
import { canViewTask, canEditTask } from '../utils/accessControl';
import { testTasks } from '../utils/testData';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: testTasks,
  isLoading: false,

  addTask: (taskData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateTask: (id, updates) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const task = get().tasks.find(t => t.id === id);
    if (!task || !canEditTask(user, task)) return;

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },

  deleteTask: (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const task = get().tasks.find(t => t.id === id);
    if (!task || !canEditTask(user, task)) return;

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  getTasksByProject: (projectId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];

    return get().tasks.filter(task => 
      task.project === projectId && canViewTask(user, task)
    );
  },

  getTasksByAssignee: (assigneeId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];

    return get().tasks.filter(task => 
      task.assignee === assigneeId && canViewTask(user, task)
    );
  },

  getTasksByStatus: (status: Task['status']) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];

    return get().tasks.filter(task => 
      task.status === status && canViewTask(user, task)
    );
  }
}));