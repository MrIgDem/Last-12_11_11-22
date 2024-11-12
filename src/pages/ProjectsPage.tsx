import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { Search, Plus, Check, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { Project, DocumentStatus } from '../types/project';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';

interface EditableCellProps {
  value: any;
  isEditing: boolean;
  onChange: (value: any) => void;
  type?: 'text' | 'date' | 'select' | 'checkbox' | 'status';
  options?: { value: string; label: string }[];
}

const documentStatusOptions = [
  { value: 'not_started', label: 'Не начат' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'review', label: 'На проверке' },
  { value: 'revision', label: 'На доработке' },
  { value: 'approved', label: 'Согласован' },
  { value: 'completed', label: 'Завершен' }
];

function EditableCell({ value, isEditing, onChange, type = 'text', options = [] }: EditableCellProps) {
  if (!isEditing) {
    if (type === 'checkbox') {
      return <span>{value ? 'Есть' : 'Нет'}</span>;
    }
    if (type === 'date') {
      return <span>{formatDate(value)}</span>;
    }
    if (type === 'status' || type === 'select') {
      const option = options.find(opt => opt.value === value);
      return <span>{option?.label || value}</span>;
    }
    return <span>{value}</span>;
  }

  switch (type) {
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      );
    case 'select':
    case 'status':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    case 'date':
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      );
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      );
  }
}

export function ProjectsPage() {
  const { user, logout } = useAuthStore();
  const { projects, updateProject, addProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Project>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!user) return null;

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditedValues(project);
  };

  const handleSave = () => {
    if (editingProject && editedValues) {
      updateProject(editingProject, editedValues);
      setEditingProject(null);
      setEditedValues({});
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setEditedValues({});
  };

  const handleChange = (field: keyof Project, value: any) => {
    setEditedValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Проекты</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Новый проект
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Поиск проектов..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заказчик</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Наименование объекта</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сроки, приоритет</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Обследование (АКТ)</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Шифр проекта</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Исполнитель</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус РД</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата передачи на проверку</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ТО Энергосвязь</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус ГИП</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Согласование</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус ИД</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата передачи заказчику</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Примечания</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project, index) => {
                const isEditing = editingProject === project.id;
                const currentValues = isEditing ? editedValues : project;

                return (
                  <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.customer}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('customer', value)}
                      />
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.name}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('name', value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col space-y-1">
                        <EditableCell
                          value={currentValues.deadline}
                          isEditing={isEditing}
                          onChange={(value) => handleChange('deadline', value)}
                          type="date"
                        />
                        <EditableCell
                          value={currentValues.priority}
                          isEditing={isEditing}
                          onChange={(value) => handleChange('priority', value)}
                          type="select"
                          options={[
                            { value: 'low', label: 'Обычный' },
                            { value: 'high', label: 'Срочно' }
                          ]}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.surveyAct}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('surveyAct', value)}
                        type="checkbox"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.code}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('code', value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.assignee}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('assignee', value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.rdStatus}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('rdStatus', value)}
                        type="status"
                        options={documentStatusOptions}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.rdReviewDate}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('rdReviewDate', value)}
                        type="date"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.toStatus}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('toStatus', value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.gipStatus}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('gipStatus', value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.approvalStatus}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('approvalStatus', value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.idStatus}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('idStatus', value)}
                        type="status"
                        options={documentStatusOptions}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.customerDeliveryDate}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('customerDeliveryDate', value)}
                        type="date"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      <EditableCell
                        value={currentValues.notes}
                        isEditing={isEditing}
                        onChange={(value) => handleChange('notes', value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Редактировать
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={addProject}
        />
      </div>
    </DashboardLayout>
  );
}