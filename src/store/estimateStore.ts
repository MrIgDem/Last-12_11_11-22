import { create } from 'zustand';
import { EstimateStore, Estimate, CostItem } from '../types/estimation';
import * as XLSX from 'xlsx';
import { generateKS2Document, generateKS3Document, generateM29Document } from '../utils/documentGenerators';

export const useEstimateStore = create<EstimateStore>((set, get) => ({
  estimates: [],
  isLoading: false,
  error: null,

  addEstimate: (estimateData) => {
    set((state) => ({
      estimates: [
        ...state.estimates,
        {
          ...estimateData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateEstimate: (id, data) => {
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === id
          ? {
              ...estimate,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : estimate
      ),
    }));
  },

  removeEstimate: (id) => {
    set((state) => ({
      estimates: state.estimates.filter((estimate) => estimate.id !== id),
    }));
  },

  addCostItem: (estimateId, itemData) => {
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === estimateId
          ? {
              ...estimate,
              items: [
                ...estimate.items,
                {
                  ...itemData,
                  id: Math.random().toString(36).substr(2, 9),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : estimate
      ),
    }));
    get().calculateTotals(estimateId);
  },

  updateCostItem: (estimateId, itemId, data) => {
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === estimateId
          ? {
              ...estimate,
              items: estimate.items.map((item) =>
                item.id === itemId
                  ? { ...item, ...data, updatedAt: new Date().toISOString() }
                  : item
              ),
              updatedAt: new Date().toISOString(),
            }
          : estimate
      ),
    }));
    get().calculateTotals(estimateId);
  },

  removeCostItem: (estimateId, itemId) => {
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === estimateId
          ? {
              ...estimate,
              items: estimate.items.filter((item) => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            }
          : estimate
      ),
    }));
    get().calculateTotals(estimateId);
  },

  approveEstimate: (id, approver) => {
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === id
          ? {
              ...estimate,
              status: 'approved',
              approvedBy: approver,
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : estimate
      ),
    }));
  },

  rejectEstimate: (id, reason) => {
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === id
          ? {
              ...estimate,
              status: 'rejected',
              comments: reason,
              updatedAt: new Date().toISOString(),
            }
          : estimate
      ),
    }));
  },

  generateKS2: async (estimateId) => {
    const estimate = get().estimates.find((e) => e.id === estimateId);
    if (!estimate) throw new Error('Смета не найдена');
    
    const document = await generateKS2Document(estimate);
    return document;
  },

  generateKS3: async (estimateId) => {
    const estimate = get().estimates.find((e) => e.id === estimateId);
    if (!estimate) throw new Error('Смета не найдена');
    
    const document = await generateKS3Document(estimate);
    return document;
  },

  generateM29: async (estimateId) => {
    const estimate = get().estimates.find((e) => e.id === estimateId);
    if (!estimate) throw new Error('Смета не найдена');
    
    const document = await generateM29Document(estimate);
    return document;
  },

  calculateTotals: (estimateId) => {
    set((state) => {
      const estimate = state.estimates.find((e) => e.id === estimateId);
      if (!estimate) return state;

      const totals = estimate.items.reduce(
        (acc, item) => {
          switch (item.type) {
            case 'material':
              acc.totalMaterialsCost += item.totalPrice;
              break;
            case 'work':
              acc.totalWorksCost += item.totalPrice;
              break;
            case 'equipment':
              acc.totalEquipmentCost += item.totalPrice;
              break;
            case 'other':
              acc.totalOtherCost += item.totalPrice;
              break;
          }
          return acc;
        },
        {
          totalMaterialsCost: 0,
          totalWorksCost: 0,
          totalEquipmentCost: 0,
          totalOtherCost: 0,
        }
      );

      const totalCost =
        totals.totalMaterialsCost +
        totals.totalWorksCost +
        totals.totalEquipmentCost +
        totals.totalOtherCost;

      return {
        estimates: state.estimates.map((e) =>
          e.id === estimateId
            ? {
                ...e,
                ...totals,
                totalCost,
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      };
    });
  },

  getEstimatesByProject: (projectId) => {
    return get().estimates.filter((estimate) => estimate.projectId === projectId);
  },

  getEstimatesByStatus: (status) => {
    return get().estimates.filter((estimate) => estimate.status === status);
  },

  searchEstimates: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().estimates.filter(
      (estimate) =>
        estimate.name.toLowerCase().includes(lowercaseQuery) ||
        estimate.number.toLowerCase().includes(lowercaseQuery) ||
        estimate.items.some((item) =>
          item.name.toLowerCase().includes(lowercaseQuery)
        )
    );
  },
}));