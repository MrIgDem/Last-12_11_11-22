import { create } from 'zustand';
import { Employee, EmployeeStore } from '../types/employee';
import { testEmployees } from '../utils/testData';

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: testEmployees,
  isLoading: false,

  addEmployee: (employeeData) => {
    set((state) => ({
      employees: [
        ...state.employees,
        {
          ...employeeData,
          id: Math.random().toString(36).substr(2, 9),
          subordinates: [],
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateEmployee: (id, data) => {
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === id ? { ...employee, ...data } : employee
      ),
    }));
  },

  removeEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter((employee) => employee.id !== id),
    }));
  },

  addSubordinate: (managerId, employeeId) => {
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === managerId
          ? {
              ...employee,
              subordinates: [...employee.subordinates, employeeId],
            }
          : employee
      ),
    }));
  },

  removeSubordinate: (managerId, employeeId) => {
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === managerId
          ? {
              ...employee,
              subordinates: employee.subordinates.filter((id) => id !== employeeId),
            }
          : employee
      ),
    }));
  },
}));