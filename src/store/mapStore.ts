import { create } from 'zustand';
import { MapStore, GeoPoint, FiberLine } from '../types/map';
import { testMapPoints, testMapLines } from '../utils/testData';

export const useMapStore = create<MapStore>((set) => ({
  points: testMapPoints,
  lines: testMapLines,
  selectedPoint: null,
  selectedLine: null,
  isLoading: false,

  addPoint: (pointData) => {
    set((state) => ({
      points: [
        ...state.points,
        {
          ...pointData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    }));
  },

  updatePoint: (id, data) => {
    set((state) => ({
      points: state.points.map((point) =>
        point.id === id ? { ...point, ...data } : point
      ),
    }));
  },

  removePoint: (id) => {
    set((state) => ({
      points: state.points.filter((point) => point.id !== id),
      lines: state.lines.filter((line) => !line.points.includes(id)),
    }));
  },

  addLine: (lineData) => {
    set((state) => ({
      lines: [
        ...state.lines,
        {
          ...lineData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    }));
  },

  updateLine: (id, data) => {
    set((state) => ({
      lines: state.lines.map((line) =>
        line.id === id ? { ...line, ...data } : line
      ),
    }));
  },

  removeLine: (id) => {
    set((state) => ({
      lines: state.lines.filter((line) => line.id !== id),
    }));
  },

  setSelectedPoint: (id) => {
    set({ selectedPoint: id });
  },

  setSelectedLine: (id) => {
    set({ selectedLine: id });
  },
}));