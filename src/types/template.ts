export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: 'РД' | 'ИД';
  tasks: TaskTemplate[];
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // в днях
  requiredRoles: string[];
  dependencies?: string[]; // ID других задач, от которых зависит эта
}

export interface TemplateStore {
  projectTemplates: ProjectTemplate[];
  isLoading: boolean;
  addProjectTemplate: (template: Omit<ProjectTemplate, 'id' | 'createdAt'>) => void;
  updateProjectTemplate: (id: string, data: Partial<ProjectTemplate>) => void;
  removeProjectTemplate: (id: string) => void;
  addTaskTemplate: (projectId: string, task: Omit<TaskTemplate, 'id'>) => void;
  updateTaskTemplate: (projectId: string, taskId: string, data: Partial<TaskTemplate>) => void;
  removeTaskTemplate: (projectId: string, taskId: string) => void;
}