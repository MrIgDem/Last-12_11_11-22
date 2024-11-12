export type StockItemType = 'cable' | 'equipment' | 'tool' | 'consumable';
export type StockItemStatus = 'available' | 'reserved' | 'in_use' | 'maintenance' | 'written_off';
export type TransactionType = 'in' | 'out';

export interface StockItem {
  id: string;
  type: StockItemType;
  name: string;
  code: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  status: StockItemStatus;
  location: string;
  quantity: number;
  unit: string;
  minQuantity?: number;
  maxQuantity?: number;
  price: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  type: TransactionType;
  quantity: number;
  date: string;
  projectId?: string;
  taskId?: string;
  notes?: string;
}

export interface InventoryStore {
  items: StockItem[];
  transactions: StockTransaction[];
  isLoading: boolean;
  error: string | null;

  addItem: (item: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, data: Partial<StockItem>) => void;
  removeItem: (id: string) => void;
  
  createTransaction: (transaction: Omit<StockTransaction, 'id' | 'date'>) => void;
  
  searchItems: (query: string) => StockItem[];
  getItemsByType: (type: StockItemType) => StockItem[];
  getItemsByStatus: (status: StockItemStatus) => StockItem[];
  getLowStockItems: () => StockItem[];
  
  getTransactionsByItem: (itemId: string) => StockTransaction[];
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => StockTransaction[];
}