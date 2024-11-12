export type IncidentSeverity = 'minor' | 'moderate' | 'major' | 'critical' | 'fatal';
export type IncidentStatus = 'reported' | 'investigating' | 'resolved' | 'closed';
export type InspectionType = 'daily' | 'weekly' | 'monthly' | 'special';
export type ViolationType = 'ppe' | 'procedure' | 'equipment' | 'documentation' | 'other';

export interface SafetyIncident {
  id: string;
  projectId: string;
  date: string;
  location: string;
  severity: IncidentSeverity;
  type: string;
  description: string;
  involvedPersons: {
    id: string;
    name: string;
    role: string;
    injury?: string;
  }[];
  witnesses: {
    id: string;
    name: string;
    contact: string;
    statement?: string;
  }[];
  immediateActions: string;
  rootCause?: string;
  correctiveActions: {
    id: string;
    description: string;
    assignee: string;
    deadline: string;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: string;
  }[];
  preventiveMeasures?: string;
  status: IncidentStatus;
  reportedBy: string;
  attachments?: {
    id: string;
    type: string;
    name: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SafetyInspection {
  id: string;
  projectId: string;
  type: InspectionType;
  date: string;
  inspector: string;
  location: string;
  checklist: {
    id: string;
    category: string;
    item: string;
    status: 'pass' | 'fail' | 'na';
    comments?: string;
    photos?: {
      id: string;
      url: string;
    }[];
  }[];
  violations: {
    id: string;
    type: ViolationType;
    description: string;
    severity: 'low' | 'medium' | 'high';
    responsiblePerson: string;
    correctiveAction: string;
    deadline: string;
    status: 'open' | 'in_progress' | 'resolved';
    resolvedAt?: string;
  }[];
  recommendations: string;
  attachments?: {
    id: string;
    type: string;
    name: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SafetyTraining {
  id: string;
  title: string;
  type: 'induction' | 'periodic' | 'special';
  description: string;
  instructor: string;
  date: string;
  duration: number;
  location: string;
  materials: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  participants: {
    id: string;
    employeeId: string;
    name: string;
    attendance: boolean;
    testScore?: number;
    certificateId?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SafetyStore {
  incidents: SafetyIncident[];
  inspections: SafetyInspection[];
  trainings: SafetyTraining[];
  isLoading: boolean;
  error: string | null;

  // Операции с инцидентами
  reportIncident: (incident: Omit<SafetyIncident, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIncident: (id: string, data: Partial<SafetyIncident>) => void;
  closeIncident: (id: string, resolution: string) => void;
  addCorrectiveAction: (incidentId: string, action: Omit<SafetyIncident['correctiveActions'][0], 'id'>) => void;
  updateCorrectiveAction: (incidentId: string, actionId: string, data: Partial<SafetyIncident['correctiveActions'][0]>) => void;

  // Операции с инспекциями
  createInspection: (inspection: Omit<SafetyInspection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInspection: (id: string, data: Partial<SafetyInspection>) => void;
  addViolation: (inspectionId: string, violation: Omit<SafetyInspection['violations'][0], 'id'>) => void;
  resolveViolation: (inspectionId: string, violationId: string, resolution: string) => void;

  // Операции с тренингами
  scheduleTraining: (training: Omit<SafetyTraining, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTraining: (id: string, data: Partial<SafetyTraining>) => void;
  recordAttendance: (trainingId: string, employeeId: string, attended: boolean) => void;
  recordTestResults: (trainingId: string, employeeId: string, score: number) => void;
  generateCertificate: (trainingId: string, employeeId: string) => Promise<string>;

  // Отчеты и аналитика
  generateSafetyReport: (projectId: string, startDate: string, endDate: string) => Promise<Blob>;
  calculateSafetyMetrics: (projectId: string) => {
    incidentRate: number;
    severityRate: number;
    inspectionComplianceRate: number;
    trainingCompletionRate: number;
    openViolations: number;
    trend: Array<{
      date: string;
      incidents: number;
      violations: number;
    }>;
  };

  // Уведомления
  getActiveIncidents: () => SafetyIncident[];
  getUpcomingTrainings: (days: number) => SafetyTraining[];
  getOverdueCorrectiveActions: () => Array<{
    incident: SafetyIncident;
    action: SafetyIncident['correctiveActions'][0];
    daysOverdue: number;
  }>;
  getExpiredCertifications: () => Array<{
    employee: { id: string; name: string };
    certification: { type: string; expiryDate: string };
    daysExpired: number;
  }>;

  // Поиск и фильтрация
  searchIncidents: (query: string) => SafetyIncident[];
  getIncidentsByProject: (projectId: string) => SafetyIncident[];
  getIncidentsBySeverity: (severity: IncidentSeverity) => SafetyIncident[];
  getIncidentsByStatus: (status: IncidentStatus) => SafetyIncident[];
  getInspectionsByProject: (projectId: string) => SafetyInspection[];
  getTrainingsByEmployee: (employeeId: string) => SafetyTraining[];
}