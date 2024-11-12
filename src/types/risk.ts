export type RiskCategory = 'technical' | 'schedule' | 'cost' | 'quality' | 'safety' | 'environmental' | 'legal' | 'other';
export type RiskProbability = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type RiskImpact = 'negligible' | 'minor' | 'moderate' | 'major' | 'severe';
export type RiskStatus = 'identified' | 'assessed' | 'mitigated' | 'closed' | 'materialized';
export type RiskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAssessment {
  id: string;
  probability: RiskProbability;
  impact: RiskImpact;
  priority: RiskPriority;
  financialImpact?: number;
  scheduleImpact?: number;
  qualityImpact?: string;
  safetyImpact?: string;
  assessedBy: string;
  assessedAt: string;
  notes?: string;
}

export interface MitigationAction {
  id: string;
  type: 'preventive' | 'corrective' | 'detective' | 'contingency';
  description: string;
  responsiblePerson: string;
  deadline: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  effectiveness?: number;
  completedAt?: string;
  notes?: string;
}

export interface RiskMonitoring {
  id: string;
  date: string;
  status: RiskStatus;
  description: string;
  indicators: {
    name: string;
    value: string;
    threshold?: string;
    status: 'normal' | 'warning' | 'critical';
  }[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  monitoredBy: string;
}

export interface Risk {
  id: string;
  projectId: string;
  category: RiskCategory;
  title: string;
  description: string;
  trigger: string;
  status: RiskStatus;
  owner: string;
  identifiedBy: string;
  identifiedAt: string;
  assessments: RiskAssessment[];
  currentAssessment?: RiskAssessment;
  mitigationPlan: {
    strategy: 'avoid' | 'transfer' | 'mitigate' | 'accept';
    actions: MitigationAction[];
    cost?: number;
    approvedBy?: string;
    approvedAt?: string;
  };
  monitoringHistory: RiskMonitoring[];
  relatedRisks?: string[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface RiskStore {
  risks: Risk[];
  isLoading: boolean;
  error: string | null;

  // Основные операции с рисками
  addRisk: (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRisk: (id: string, data: Partial<Risk>) => void;
  removeRisk: (id: string) => void;

  // Операции с оценками
  addAssessment: (riskId: string, assessment: Omit<RiskAssessment, 'id'>) => void;
  updateCurrentAssessment: (riskId: string, assessment: Partial<RiskAssessment>) => void;

  // Операции с планом снижения рисков
  addMitigationAction: (riskId: string, action: Omit<MitigationAction, 'id'>) => void;
  updateMitigationAction: (riskId: string, actionId: string, data: Partial<MitigationAction>) => void;
  removeMitigationAction: (riskId: string, actionId: string) => void;
  approveMitigationPlan: (riskId: string, approver: string) => void;

  // Мониторинг рисков
  addMonitoringRecord: (riskId: string, record: Omit<RiskMonitoring, 'id'>) => void;
  updateMonitoringRecord: (riskId: string, recordId: string, data: Partial<RiskMonitoring>) => void;

  // Отчеты и аналитика
  generateRiskMatrix: () => Array<{
    probability: RiskProbability;
    impact: RiskImpact;
    risks: Risk[];
  }>;
  generateRiskReport: (projectId: string) => Promise<Blob>;
  calculateRiskExposure: (projectId: string) => {
    total: number;
    byCategory: Record<RiskCategory, number>;
    trend: Array<{
      date: string;
      value: number;
    }>;
  };

  // Уведомления
  getHighPriorityRisks: () => Risk[];
  getUpcomingMitigationActions: (days: number) => Array<{
    risk: Risk;
    action: MitigationAction;
    daysLeft: number;
  }>;
  getOverdueMitigationActions: () => Array<{
    risk: Risk;
    action: MitigationAction;
    daysOverdue: number;
  }>;

  // Поиск и фильтрация
  searchRisks: (query: string) => Risk[];
  getRisksByProject: (projectId: string) => Risk[];
  getRisksByCategory: (category: RiskCategory) => Risk[];
  getRisksByStatus: (status: RiskStatus) => Risk[];
  getRisksByPriority: (priority: RiskPriority) => Risk[];
  getRisksByOwner: (owner: string) => Risk[];
}