import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useEmployeeStore } from '../store/employeeStore';
import { Employee, EmployeeRole, Department } from '../types/employee';
import { AccessLevel } from '../types/auth';
import { Users, UserPlus, Phone, Mail, ChevronDown, ChevronRight, Shield, Pencil, Trash2 } from 'lucide-react';

export function EmployeesPage() {
  const { user, logout, register } = useAuthStore();
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployeeStore();
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<Department[]>(['management']);
  const [error, setError] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id' | 'createdAt' | 'subordinates'> & {
    password: string;
    accessLevel: AccessLevel;
  }>({
    name: '',
    role: 'engineer',
    department: 'engineering',
    position: '',
    email: '',
    phone: '',
    password: '',
    accessLevel: 'user',
  });

  if (!user) return null;

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // First register the user in the auth system
      await register({
        username: newEmployee.email.split('@')[0],
        name: newEmployee.name,
        role: newEmployee.role,
        accessLevel: newEmployee.accessLevel,
        email: newEmployee.email,
        phone: newEmployee.phone,
        department: newEmployee.department,
        position: newEmployee.position,
        password: newEmployee.password,
      });

      // Then add to employee store
      const { password, accessLevel, ...employeeData } = newEmployee;
      addEmployee(employeeData);
      
      setNewEmployee({
        name: '',
        role: 'engineer',
        department: 'engineering',
        position: '',
        email: '',
        phone: '',
        password: '',
        accessLevel: 'user',
      });
      
      setIsAddingEmployee(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add employee');
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, editingEmployee);
      setEditingEmployee(null);
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      removeEmployee(employeeId);
    }
  };

  const departmentEmployees = employees.reduce((acc, employee) => {
    if (!acc[employee.department]) {
      acc[employee.department] = [];
    }
    acc[employee.department].push(employee);
    return acc;
  }, {} as Record<Department, Employee[]>);

  const toggleDepartment = (department: Department) => {
    setExpandedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const getDepartmentName = (department: Department): string => {
    switch (department) {
      case 'management': return 'Руководство';
      case 'engineering': return 'Инженерный отдел';
      case 'installation': return 'Монтажный отдел';
      case 'accounting': return 'Бухгалтерия';
      default: return department;
    }
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Сотрудники</h1>
          <button
            onClick={() => setIsAddingEmployee(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Добавить сотрудника
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {Object.entries(departmentEmployees).map(([department, deptEmployees]) => (
              <div key={department} className="mb-4">
                <button
                  onClick={() => toggleDepartment(department as Department)}
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                >
                  {expandedDepartments.includes(department as Department) ? (
                    <ChevronDown className="h-5 w-5 mr-2 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">
                    {getDepartmentName(department as Department)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({deptEmployees.length})
                  </span>
                </button>

                {expandedDepartments.includes(department as Department) && (
                  <div className="mt-2 space-y-2 ml-6">
                    {deptEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {employee.position}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <a
                            href={`mailto:${employee.email}`}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                          <a
                            href={`tel:${employee.phone}`}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Phone className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => setEditingEmployee(employee)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal for adding employee */}
        {isAddingEmployee && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsAddingEmployee(false)} />
              
              <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Добавить сотрудника
                </h3>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ФИО
                    </label>
                    <input
                      type="text"
                      required
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        name: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Должность
                    </label>
                    <input
                      type="text"
                      required
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        position: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Отдел
                    </label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        department: e.target.value as Department,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="management">Руководство</option>
                      <option value="engineering">Инженерный отдел</option>
                      <option value="installation">Монтажный отдел</option>
                      <option value="accounting">Бухгалтерия</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Роль
                    </label>
                    <select
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        role: e.target.value as EmployeeRole,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="engineer">Инженер</option>
                      <option value="installer">Монтажник</option>
                      <option value="manager">Менеджер</option>
                      {user.accessLevel === 'admin' && (
                        <option value="director">Директор</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        email: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      required
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        phone: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Пароль для входа в систему
                    </label>
                    <input
                      type="password"
                      required
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        password: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Уровень доступа
                    </label>
                    <select
                      value={newEmployee.accessLevel}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee,
                        accessLevel: e.target.value as AccessLevel,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="user">Пользователь</option>
                      <option value="manager">Менеджер</option>
                      {user.accessLevel === 'admin' && (
                        <option value="admin">Администратор</option>
                      )}
                    </select>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingEmployee(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Добавить
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal for editing employee */}
        {editingEmployee && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setEditingEmployee(null)} />
              
              <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Редактировать сотрудника
                </h3>

                <form onSubmit={handleUpdateEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ФИО
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.name}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        name: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Должность
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.position}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        position: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Отдел
                    </label>
                    <select
                      value={editingEmployee.department}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        department: e.target.value as Department,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="management">Руководство</option>
                      <option value="engineering">Инженерный отдел</option>
                      <option value="installation">Монтажный отдел</option>
                      <option value="accounting">Бухгалтерия</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        email: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      required
                      value={editingEmployee.phone}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        phone: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingEmployee(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Сохранить
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}