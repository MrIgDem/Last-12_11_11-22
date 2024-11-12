import { create } from 'zustand';
import { Equipment, EquipmentStore } from '../types/equipment';
import { testEquipment } from '../utils/testData';

export const useEquipmentStore = create<EquipmentStore>((set) => ({
  equipment: testEquipment,
  isLoading: false,

  addEquipment: (equipmentData) => {
    set((state) => ({
      equipment: [
        ...state.equipment,
        {
          ...equipmentData,
          id: Math.random().toString(36).substr(2, 9),
          verifications: [],
        },
      ],
    }));
  },

  updateEquipment: (id, data) => {
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, ...data } : eq
      ),
    }));
  },

  removeEquipment: (id) => {
    set((state) => ({
      equipment: state.equipment.filter((eq) => eq.id !== id),
    }));
  },

  addVerification: (verificationData) => {
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === verificationData.equipmentId
          ? {
              ...eq,
              verifications: [
                ...eq.verifications,
                {
                  ...verificationData,
                  id: Math.random().toString(36).substr(2, 9),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : eq
      ),
    }));
  },

  removeVerification: (id) => {
    set((state) => ({
      equipment: state.equipment.map((eq) => ({
        ...eq,
        verifications: eq.verifications.filter((v) => v.id !== id),
      })),
    }));
  },
}));