export type InspectionType = 'incoming' | 'process' | 'final';
export type InspectionStatus = 'pending' | 'passed' | 'failed' | 'conditional';
export type DefectType = 'material' | 'workmanship' | 'design' | 'documentation' | 'other';
export type DefectSeverity = 'critical' | 'major' | 'minor';

export interface QualityStandard {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  effectiveDate: string;
  requirements: {
    id: string;
    category: string;
    description: string;
    acceptanceCriteria: string;
    testMethod?: string;
  }[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  type: InspectionType;
  projectId: string;
  location: string;
  inspector: string;
  date: string;
  status: InspectionStatus;
  standards: string[]; // ID стандартов
  checkpoints: {
    id: string;
    standardRequirementId: string;
    result: 'pass' | 'fail' | 'na';
    measurement?: string;
    notes?: string;
  }[];
  defects: {
    id: string;
    type: DefectType;
    severity: DefectSeverity;
    description: string;
    location: string;
    photos?: {
      id: string;
      url: string;
      description?: string;
    }[];
    correctiveAction?: string;
    status: 'open' | 'in_progress' | 'resolved';
  }[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QualityReport {
  id: string;
  projectId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'completion';
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalInspections: number;
    passedInspections: number;
    failedInspections: number;
    openDefects: number;
    resolvedDefects: number;
  };
  inspections: string[]; // ID инспекций
  findings: string;
  recommendations: string;
  approvedBy?: string;
  approvedAt?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface QualityStore {
  standards: QualityStandard[];
  inspections: Inspection[];
  reports: QualityReport[];
  isLoading: boolean;
  error: string | null;

  // Операции со стандартами
  addStandard: (standard: Omit<QualityStandard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStandard: (id: string, data: Partial<QualityStandard>) => void;
  removeStandard: (id: string) => void;

  // Операции с инспекциями
  createInspection: (inspection: Omit<Inspection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInspection: (id: string, data: Partial<Inspection>) => void;
  removeInspection: (id: string) => void;
  addDefect: (inspectionId: string, defect: Omit<Inspection['defects'][0], 'id'>) => void;
  updateDefect: (inspectionId: string, defectId: string, data: Partial<Inspection['defects'][0]>) => void;

  // Операции с отчетами
  generateReport: (projectId: string, type: QualityReport['type'], period: QualityReport['period']) => void;
  approveReport: (id: string, approver: string) => void;
  updateReport: (id: string, data: Partial<QualityReport>) => void;

  // Аналитика и статистика
  getProjectStatistics: (projectId: string) => {
    inspectionsByType: Record<InspectionType, number>;
    defectsByType: Record<DefectType, number>;
    defectsBySeverity: Record<DefectSeverity, number>;
    defectTrend: Array<{
      date: string;
      count: number;
    }>;
    resolutionRate: number;
  };

  // Поиск и фильтрация
  searchInspections: (query: string) => Inspection[];
  getInspectionsByProject: (projectId: string) => Inspection[];
  getInspectionsByType: (type: InspectionType) => Inspection[];
  getInspectionsByStatus: (status: InspectionStatus) => Inspection[];
  getOpenDefects: () => Array<{ inspection: Inspection; defect: Inspection['defects'][0] }>;
}