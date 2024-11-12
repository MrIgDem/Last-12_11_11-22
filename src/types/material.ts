export interface Material {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  productionDate: string;
  expiryDate: string;
  certificateUrl?: string;
  specifications?: string;
  createdAt: string;
}

export interface MaterialStore {
  materials: Material[];
  isLoading: boolean;
  addMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
  updateMaterial: (id: string, data: Partial<Material>) => void;
  removeMaterial: (id: string) => void;
}