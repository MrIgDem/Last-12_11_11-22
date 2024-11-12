import { create } from 'zustand';
import { SpecificationStore, Specification } from '../types/specification';
import * as XLSX from 'xlsx';
import { PDFDocument, rgb } from '@react-pdf/renderer';

const mockSpecifications: Specification[] = [
  {
    id: '1',
    projectId: '1',
    name: 'Спецификация ВОЛС Москва-Казань',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    materials: [
      {
        id: '1',
        name: 'Кабель оптический',
        type: 'cable',
        unit: 'м',
        quantity: 1000,
        unitPrice: 100,
        totalPrice: 100000,
      }
    ],
    works: [
      {
        id: '1',
        name: 'Прокладка кабеля',
        unit: 'м',
        quantity: 1000,
        unitPrice: 50,
        totalPrice: 50000,
        category: 'installation',
      }
    ],
    totalMaterialsCost: 100000,
    totalWorksCost: 50000,
    totalCost: 150000,
  }
];

export const useSpecificationStore = create<SpecificationStore>((set, get) => ({
  specifications: mockSpecifications,
  isLoading: false,

  addSpecification: (specData) => {
    set((state) => ({
      specifications: [
        ...state.specifications,
        {
          ...specData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateSpecification: (id, data) => {
    set((state) => ({
      specifications: state.specifications.map((spec) =>
        spec.id === id
          ? {
              ...spec,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : spec
      ),
    }));
  },

  removeSpecification: (id) => {
    set((state) => ({
      specifications: state.specifications.filter((spec) => spec.id !== id),
    }));
  },

  addMaterialItem: (specId, item) => {
    set((state) => ({
      specifications: state.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              materials: [
                ...spec.materials,
                {
                  ...item,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : spec
      ),
    }));
    get().calculateTotals(specId);
  },

  updateMaterialItem: (specId, itemId, data) => {
    set((state) => ({
      specifications: state.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              materials: spec.materials.map((item) =>
                item.id === itemId ? { ...item, ...data } : item
              ),
              updatedAt: new Date().toISOString(),
            }
          : spec
      ),
    }));
    get().calculateTotals(specId);
  },

  removeMaterialItem: (specId, itemId) => {
    set((state) => ({
      specifications: state.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              materials: spec.materials.filter((item) => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            }
          : spec
      ),
    }));
    get().calculateTotals(specId);
  },

  addWorkItem: (specId, item) => {
    set((state) => ({
      specifications: state.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              works: [
                ...spec.works,
                {
                  ...item,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : spec
      ),
    }));
    get().calculateTotals(specId);
  },

  updateWorkItem: (specId, itemId, data) => {
    set((state) => ({
      specifications: state.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              works: spec.works.map((item) =>
                item.id === itemId ? { ...item, ...data } : item
              ),
              updatedAt: new Date().toISOString(),
            }
          : spec
      ),
    }));
    get().calculateTotals(specId);
  },

  removeWorkItem: (specId, itemId) => {
    set((state) => ({
      specifications: state.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              works: spec.works.filter((item) => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            }
          : spec
      ),
    }));
    get().calculateTotals(specId);
  },

  calculateTotals: (specId) => {
    set((state) => {
      const spec = state.specifications.find((s) => s.id === specId);
      if (!spec) return state;

      const totalMaterialsCost = spec.materials.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const totalWorksCost = spec.works.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      return {
        specifications: state.specifications.map((s) =>
          s.id === specId
            ? {
                ...s,
                totalMaterialsCost,
                totalWorksCost,
                totalCost: totalMaterialsCost + totalWorksCost,
                updatedAt: new Date().toISOString(),
              }
            : s
        ),
      };
    });
  },

  exportToExcel: (specId) => {
    const spec = get().specifications.find((s) => s.id === specId);
    if (!spec) return;

    const wb = XLSX.utils.book_new();
    
    // Materials sheet
    const materialsData = spec.materials.map(m => ({
      'Наименование': m.name,
      'Тип': m.type,
      'Ед.изм.': m.unit,
      'Кол-во': m.quantity,
      'Цена': m.unitPrice,
      'Сумма': m.totalPrice,
    }));
    const materialsWs = XLSX.utils.json_to_sheet(materialsData);
    XLSX.utils.book_append_sheet(wb, materialsWs, 'Материалы');

    // Works sheet
    const worksData = spec.works.map(w => ({
      'Наименование': w.name,
      'Категория': w.category,
      'Ед.изм.': w.unit,
      'Кол-во': w.quantity,
      'Цена': w.unitPrice,
      'Сумма': w.totalPrice,
    }));
    const worksWs = XLSX.utils.json_to_sheet(worksData);
    XLSX.utils.book_append_sheet(wb, worksWs, 'Работы');

    XLSX.writeFile(wb, `Спецификация_${spec.name}.xlsx`);
  },

  generatePdf: async (specId) => {
    const spec = get().specifications.find((s) => s.id === specId);
    if (!spec) return;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add content to PDF
    page.drawText(`Спецификация: ${spec.name}`, {
      x: 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  },
}));