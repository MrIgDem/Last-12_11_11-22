export interface GeoPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'node' | 'equipment' | 'splice';
  name: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface FiberLine {
  id: string;
  points: string[]; // IDs of connected points
  type: 'underground' | 'aerial';
  length: number; // in meters
  fiberCount: number;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface MapStore {
  points: GeoPoint[];
  lines: FiberLine[];
  selectedPoint: string | null;
  selectedLine: string | null;
  isLoading: boolean;
  
  addPoint: (point: Omit<GeoPoint, 'id'>) => void;
  updatePoint: (id: string, data: Partial<GeoPoint>) => void;
  removePoint: (id: string) => void;
  
  addLine: (line: Omit<FiberLine, 'id'>) => void;
  updateLine: (id: string, data: Partial<FiberLine>) => void;
  removeLine: (id: string) => void;
  
  setSelectedPoint: (id: string | null) => void;
  setSelectedLine: (id: string | null) => void;
}