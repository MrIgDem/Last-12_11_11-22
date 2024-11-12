export type EmployeeRole = 'director' | 'engineer' | 'installer' | 'manager';
export type Department = 'management' | 'engineering' | 'installation' | 'accounting';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  department: Department;
  position: string;
  email: string;
  phone: string;
  reportsTo?: string; // ID руководителя
  subordinates: string[]; // ID подчиненных
  createdAt: string;
}

export interface EmployeeStore {
  employees: Employee[];
  isLoading: boolean;
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'subordinates'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  addSubordinate: (managerId: string, employeeId: string) => void;
  removeSubordinate: (managerId: string, employeeId: string) => void;
}