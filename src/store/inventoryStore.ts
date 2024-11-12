import { create } from 'zustand';
import { InventoryStore, StockItem, StockTransaction } from '../types/inventory';
import { testInventory } from '../utils/testData';

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: testInventory,
  transactions: [],
  isLoading: false,
  error: null,

  addItem: (itemData) => {
    set((state) => ({
      items: [
        ...state.items,
        {
          ...itemData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateItem: (id, data) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  createTransaction: (transactionData) => {
    const item = get().items.find(i => i.id === transactionData.itemId);
    if (!item) return;

    let newQuantity = item.quantity;
    if (transactionData.type === 'in') {
      newQuantity += transactionData.quantity;
    } else if (transactionData.type === 'out') {
      if (newQuantity < transactionData.quantity) {
        set({ error: 'Недостаточное количество на складе' });
        return;
      }
      newQuantity -= transactionData.quantity;
    }

    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transactionData,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
        },
      ],
      items: state.items.map((item) =>
        item.id === transactionData.itemId
          ? { ...item, quantity: newQuantity }
          : item
      ),
      error: null,
    }));
  },

  searchItems: (query) => {
    const items = get().items;
    const lowercaseQuery = query.toLowerCase();
    return items.filter(
      item =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.code.toLowerCase().includes(lowercaseQuery)
    );
  },

  getItemsByType: (type) => {
    return get().items.filter(item => item.type === type);
  },

  getItemsByStatus: (status) => {
    return get().items.filter(item => item.status === status);
  },

  getLowStockItems: () => {
    return get().items.filter(
      item => item.minQuantity !== undefined && item.quantity <= item.minQuantity
    );
  },

  getTransactionsByItem: (itemId) => {
    return get().transactions.filter(t => t.itemId === itemId);
  },

  getTransactionsByDateRange: (startDate, endDate) => {
    return get().transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }
}));