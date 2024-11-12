export type TaskDependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
export type ResourceType = 'team' | 'equipment' | 'material';
export type ScheduleStatus = 'planned' | 'in_progress' | 'completed' | 'delayed' | 'on_hold';

export interface TaskDependency {
  id: string;
  predecessorId: string;
  successorId: string;
  type: TaskDependencyType;
  lag: number; // в днях
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  capacity: number;
  unit: string;
  cost: number;
  availability: {
    startDate: string;
    endDate: string;
    quantity: number;
  }[];
}

export interface ScheduleTask {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: ScheduleStatus;
  dependencies: TaskDependency[];
  resources: {
    resourceId: string;
    quantity: number;
  }[];
  criticalPath: boolean;
  slack: number;
  baseline?: {
    startDate: string;
    endDate: string;
    duration: number;
  };
  actualStart?: string;
  actualEnd?: string;
  actualDuration?: number;
  constraints?: {
    type: 'must_start_on' | 'must_finish_on' | 'start_no_earlier_than' | 'finish_no_later_than';
    date: string;
  };
}

export interface Schedule {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  tasks: ScheduleTask[];
  resources: Resource[];
  criticalPath: string[]; // массив ID задач
  progress: number;
  status: ScheduleStatus;
  baseline?: {
    startDate: string;
    endDate: string;
    tasks: {
      id: string;
      startDate: string;
      endDate: string;
    }[];
  };
}

export interface CalendarStore {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;

  // Основные операции с расписаниями
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, data: Partial<Schedule>) => void;
  removeSchedule: (id: string) => void;

  // Операции с задачами
  addTask: (scheduleId: string, task: Omit<ScheduleTask, 'id'>) => void;
  updateTask: (scheduleId: string, taskId: string, data: Partial<ScheduleTask>) => void;
  removeTask: (scheduleId: string, taskId: string) => void;

  // Операции с ресурсами
  addResource: (scheduleId: string, resource: Omit<Resource, 'id'>) => void;
  updateResource: (scheduleId: string, resourceId: string, data: Partial<Resource>) => void;
  removeResource: (scheduleId: string, resourceId: string) => void;

  // Операции с зависимостями
  addDependency: (scheduleId: string, dependency: Omit<TaskDependency, 'id'>) => void;
  removeDependency: (scheduleId: string, dependencyId: string) => void;

  // Расчеты
  calculateCriticalPath: (scheduleId: string) => void;
  calculateProgress: (scheduleId: string) => void;
  detectResourceConflicts: (scheduleId: string) => {
    taskId: string;
    resourceId: string;
    startDate: string;
    endDate: string;
    type: 'overallocation' | 'unavailable';
  }[];

  // Базовый план
  saveBaseline: (scheduleId: string) => void;
  revertToBaseline: (scheduleId: string) => void;

  // Экспорт
  exportToMSProject: (scheduleId: string) => Promise<Blob>;
  exportToExcel: (scheduleId: string) => Promise<Blob>;

  // Фильтры и поиск
  getSchedulesByProject: (projectId: string) => Schedule[];
  getSchedulesByStatus: (status: ScheduleStatus) => Schedule[];
  searchSchedules: (query: string) => Schedule[];
  
  // Уведомления
  getUpcomingDeadlines: (days: number) => {
    taskId: string;
    scheduleName: string;
    taskName: string;
    deadline: string;
    daysLeft: number;
  }[];
}