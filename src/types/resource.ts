export type ResourceType = 'human' | 'equipment' | 'material' | 'vehicle';
export type ResourceStatus = 'available' | 'busy' | 'maintenance' | 'unavailable';
export type AllocationStatus = 'planned' | 'active' | 'completed' | 'cancelled';

export interface ResourceCapacity {
  id: string;
  resourceId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  unit: string;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  projectId: string;
  taskId?: string;
  startDate: string;
  endDate: string;
  quantity: number;
  status: AllocationStatus;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  code: string;
  description?: string;
  status: ResourceStatus;
  capacity: ResourceCapacity[];
  skills?: string[];
  certifications?: {
    name: string;
    validUntil: string;
  }[];
  location?: string;
  cost: {
    hourly?: number;
    daily?: number;
    monthly?: number;
  };
  workSchedule?: {
    workDays: number[];
    workHours: {
      start: string;
      end: string;
    };
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceConflict {
  resourceId: string;
  type: 'overallocation' | 'unavailable' | 'maintenance';
  startDate: string;
  endDate: string;
  requiredQuantity: number;
  availableQuantity: number;
  affectedAllocations: ResourceAllocation[];
}

export interface ResourceUtilization {
  resourceId: string;
  period: {
    start: string;
    end: string;
  };
  capacity: number;
  allocated: number;
  utilizationRate: number;
  allocations: ResourceAllocation[];
}

export interface ResourceStore {
  resources: Resource[];
  allocations: ResourceAllocation[];
  isLoading: boolean;
  error: string | null;

  // Управление ресурсами
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResource: (id: string, data: Partial<Resource>) => void;
  removeResource: (id: string) => void;
  updateResourceStatus: (id: string, status: ResourceStatus) => void;

  // Управление мощностями
  addCapacity: (resourceId: string, capacity: Omit<ResourceCapacity, 'id'>) => void;
  updateCapacity: (resourceId: string, capacityId: string, data: Partial<ResourceCapacity>) => void;
  removeCapacity: (resourceId: string, capacityId: string) => void;

  // Распределение ресурсов
  allocateResource: (allocation: Omit<ResourceAllocation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAllocation: (id: string, data: Partial<ResourceAllocation>) => void;
  removeAllocation: (id: string) => void;
  completeAllocation: (id: string) => void;

  // Анализ и планирование
  getResourceUtilization: (resourceId: string, startDate: string, endDate: string) => ResourceUtilization;
  getResourceConflicts: (resourceId: string, startDate: string, endDate: string) => ResourceConflict[];
  getAvailableResources: (
    type: ResourceType,
    startDate: string,
    endDate: string,
    quantity: number
  ) => Resource[];
  optimizeAllocations: (projectId: string) => ResourceAllocation[];

  // Отчеты
  generateUtilizationReport: (startDate: string, endDate: string) => Promise<Blob>;
  generateCapacityReport: (startDate: string, endDate: string) => Promise<Blob>;
  generateAllocationReport: (projectId?: string) => Promise<Blob>;

  // Поиск и фильтрация
  searchResources: (query: string) => Resource[];
  getResourcesByType: (type: ResourceType) => Resource[];
  getResourcesByStatus: (status: ResourceStatus) => Resource[];
  getResourcesBySkill: (skill: string) => Resource[];
  getAllocationsByProject: (projectId: string) => ResourceAllocation[];
  getAllocationsByResource: (resourceId: string) => ResourceAllocation[];
}