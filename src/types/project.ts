export type ProjectStatus = 
  | 'new'           // Новый
  | 'in_progress'   // В работе
  | 'review'        // На проверке
  | 'approved'      // Согласован
  | 'completed'     // Завершен
  | 'on_hold'       // Приостановлен
  | 'cancelled';    // Отменен

export type ProjectType = 'b2b' | 'b2c' | 'government';

export type DocumentStatus =
  | 'not_started'    // Не начат
  | 'in_progress'    // В работе
  | 'review'         // На проверке
  | 'revision'       // На доработке
  | 'approved'       // Согласован
  | 'completed';     // Завершен

export interface ProjectStage {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: DocumentStatus;
  completionPercentage: number;
  dependencies?: string[]; // IDs of stages this stage depends on
}

export interface ProjectAttachment {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Project {
  id: string;
  type: ProjectType;           // Тип проекта
  customer: string;           // Заказчик
  name: string;              // Наименование объекта
  deadline: string;          // Срок выполнения
  priority: 'low' | 'high';  // Приоритет
  surveyAct: boolean;        // Обследование (АКТ)
  code: string;             // Шифр проекта
  assignee: string;         // Исполнитель
  startDate: string;        // Дата начала
  stages: ProjectStage[];    // Этапы проекта
  
  // Рабочая документация (РД)
  rdStatus: DocumentStatus;    // Статус РД
  rdReviewDate?: string;      // Дата передачи РД на проверку
  rdApprovalDate?: string;    // Дата согласования РД
  rdComments?: string;        // Комментарии по РД

  // Исполнительная документация (ИД)
  idStatus: DocumentStatus;    // Статус ИД
  idStartDate?: string;       // Дата начала ИД
  idReviewDate?: string;      // Дата передачи ИД на проверку
  idApprovalDate?: string;    // Дата согласования ИД
  idComments?: string;        // Комментарии по ИД

  // Согласования
  toStatus: string;          // ТО Энергосвязь
  gipStatus: string;         // Статус ГИП
  approvalStatus: string;    // Согласование
  
  customerDeliveryDate?: string;  // Дата передачи заказчику
  notes?: string;               // Примечания

  // Технические характеристики
  cableLength?: number;        // Длина кабеля (м)
  nodeCount?: number;          // Количество узлов
  equipmentCount?: number;     // Количество оборудования

  // Прикрепленные файлы
  attachments?: ProjectAttachment[];
}

export interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  
  addProject: (project: Omit<Project, 'id' | 'stages'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addStage: (projectId: string, stage: Omit<ProjectStage, 'id' | 'status' | 'completionPercentage'>) => void;
  updateStage: (projectId: string, stageId: string, data: Partial<ProjectStage>) => void;
  deleteStage: (projectId: string, stageId: string) => void;
  
  getProjectsByType: (type: ProjectType) => Project[];
  getProjectsByStatus: (status: DocumentStatus) => Project[];
}