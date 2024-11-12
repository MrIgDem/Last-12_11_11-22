export interface MaterialItem {
  id: string;
  name: string;
  type: 'cable' | 'equipment' | 'accessory';
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface WorkItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: 'installation' | 'configuration' | 'testing';
}

export interface Specification {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  materials: MaterialItem[];
  works: WorkItem[];
  totalMaterialsCost: number;
  totalWorksCost: number;
  totalCost: number;
}

export interface SpecificationStore {
  specifications: Specification[];
  isLoading: boolean;
  
  addSpecification: (spec: Omit<Specification, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpecification: (id: string, data: Partial<Specification>) => void;
  removeSpecification: (id: string) => void;
  
  addMaterialItem: (specId: string, item: Omit<MaterialItem, 'id'>) => void;
  updateMaterialItem: (specId: string, itemId: string, data: Partial<MaterialItem>) => void;
  removeMaterialItem: (specId: string, itemId: string) => void;
  
  addWorkItem: (specId: string, item: Omit<WorkItem, 'id'>) => void;
  updateWorkItem: (specId: string, itemId: string, data: Partial<WorkItem>) => void;
  removeWorkItem: (specId: string, itemId: string) => void;
  
  calculateTotals: (specId: string) => void;
  exportToExcel: (specId: string) => void;
  generatePdf: (specId: string) => void;
}