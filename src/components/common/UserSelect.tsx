import React from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { User } from '../../types/auth';

interface UserSelectProps {
  value: string;
  onChange: (userId: string) => void;
  role?: string[];
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function UserSelect({ 
  value, 
  onChange, 
  role = [], 
  label = 'Ответственный',
  required = false,
  placeholder = 'Выберите ответственного',
  className = ''
}: UserSelectProps) {
  const { employees } = useEmployeeStore();

  // Фильтруем сотрудников по роли, если указана
  const filteredEmployees = role.length > 0 
    ? employees.filter(emp => role.includes(emp.role))
    : employees;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">{placeholder}</option>
        {filteredEmployees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name} - {employee.position}
          </option>
        ))}
      </select>
    </div>
  );
}