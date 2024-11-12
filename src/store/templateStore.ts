import { create } from 'zustand';
import { TemplateStore, ProjectTemplate } from '../types/template';

const mockTemplates: ProjectTemplate[] = [
  {
    id: '1',
    name: 'Типовой проект ВОЛС',
    description: 'Шаблон для проектов строительства ВОЛС',
    type: 'РД',
    tasks: [
      {
        id: '1',
        title: 'Подготовка исходных данных',
        description: 'Сбор и анализ исходных данных для проектирования',
        priority: 'high',
        estimatedDuration: 5,
        requiredRoles: ['engineer'],
      },
      {
        id: '2',
        title: 'Разработка схемы трассы',
        description: 'Проектирование схемы прокладки ВОЛС',
        priority: 'high',
        estimatedDuration: 10,
        requiredRoles: ['engineer'],
        dependencies: ['1'],
      },
    ],
    createdAt: '2024-03-01',
  },
  {
    id: '2',
    name: 'Шаблон исполнительной документации',
    description: 'Типовой набор документов для ИД',
    type: 'ИД',
    tasks: [
      {
        id: '1',
        title: 'Сбор актов выполненных работ',
        description: 'Подготовка и оформление актов',
        priority: 'medium',
        estimatedDuration: 3,
        requiredRoles: ['engineer'],
      },
    ],
    createdAt: '2024-03-01',
  },
];

export const useTemplateStore = create<TemplateStore>((set) => ({
  projectTemplates: mockTemplates,
  isLoading: false,

  addProjectTemplate: (templateData) => {
    set((state) => ({
      projectTemplates: [
        ...state.projectTemplates,
        {
          ...templateData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateProjectTemplate: (id, data) => {
    set((state) => ({
      projectTemplates: state.projectTemplates.map((template) =>
        template.id === id ? { ...template, ...data } : template
      ),
    }));
  },

  removeProjectTemplate: (id) => {
    set((state) => ({
      projectTemplates: state.projectTemplates.filter(
        (template) => template.id !== id
      ),
    }));
  },

  addTaskTemplate: (projectId, taskData) => {
    set((state) => ({
      projectTemplates: state.projectTemplates.map((template) =>
        template.id === projectId
          ? {
              ...template,
              tasks: [
                ...template.tasks,
                {
                  ...taskData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
            }
          : template
      ),
    }));
  },

  updateTaskTemplate: (projectId, taskId, data) => {
    set((state) => ({
      projectTemplates: state.projectTemplates.map((template) =>
        template.id === projectId
          ? {
              ...template,
              tasks: template.tasks.map((task) =>
                task.id === taskId ? { ...task, ...data } : task
              ),
            }
          : template
      ),
    }));
  },

  removeTaskTemplate: (projectId, taskId) => {
    set((state) => ({
      projectTemplates: state.projectTemplates.map((template) =>
        template.id === projectId
          ? {
              ...template,
              tasks: template.tasks.filter((task) => task.id !== taskId),
            }
          : template
      ),
    }));
  },
}));