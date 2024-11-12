export type CostItemType = 'material' | 'work' | 'equipment' | 'other';
export type CostItemStatus = 'draft' | 'approved' | 'rejected';
export type DocumentType = 'KS2' | 'KS3' | 'M29';

export interface CostItem {
  id: string;
  projectId: string;
  type: CostItemType;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: CostItemStatus;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Estimate {
  id: string;
  projectId: string;
  name: string;
  number: string;
  status: CostItemStatus;
  items: CostItem[];
  totalMaterialsCost: number;
  totalWorksCost: number;
  totalEquipmentCost: number;
  totalOtherCost: number;
  totalCost: number;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
  documents: {
    type: DocumentType;
    number: string;
    date: string;
    url?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface EstimateStore {
  estimates: Estimate[];
  isLoading: boolean;
  error: string | null;
  
  // Основные операции со сметами
  addEstimate: (estimate: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEstimate: (id: string, data: Partial<Estimate>) => void;
  removeEstimate: (id: string) => void;
  
  // Операции с позициями сметы
  addCostItem: (estimateId: string, item: Omit<CostItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCostItem: (estimateId: string, itemId: string, data: Partial<CostItem>) => void;
  removeCostItem: (estimateId: string, itemId: string) => void;
  
  // Утверждение сметы
  approveEstimate: (id: string, approver: string) => void;
  rejectEstimate: (id: string, reason: string) => void;
  
  // Экспорт документов
  generateKS2: (estimateId: string) => Promise<string>; // Returns URL
  generateKS3: (estimateId: string) => Promise<string>; // Returns URL
  generateM29: (estimateId: string) => Promise<string>; // Returns URL
  
  // Расчеты
  calculateTotals: (estimateId: string) => void;
  
  // Фильтры и поиск
  getEstimatesByProject: (projectId: string) => Estimate[];
  getEstimatesByStatus: (status: CostItemStatus) => Estimate[];
  searchEstimates: (query: string) => Estimate[];
}