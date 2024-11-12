export type VerificationType = 'calibration' | 'test' | 'maintenance';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  verifications: Verification[];
}

export interface Verification {
  id: string;
  equipmentId: string;
  type: VerificationType;
  date: string;
  nextDate: string;
  documentUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface EquipmentStore {
  equipment: Equipment[];
  isLoading: boolean;
  addEquipment: (equipment: Omit<Equipment, 'id' | 'verifications'>) => void;
  updateEquipment: (id: string, data: Partial<Equipment>) => void;
  removeEquipment: (id: string) => void;
  addVerification: (verification: Omit<Verification, 'id' | 'createdAt'>) => void;
  removeVerification: (id: string) => void;
}