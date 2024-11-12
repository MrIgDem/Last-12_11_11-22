import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Project } from '../../types/project';
import { useTaskStore } from '../../store/taskStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { generateProjectTasks } from '../../utils/projectTasks';
import { DocumentUpload } from '../documents/DocumentUpload';
import { useAuthStore } from '../../store/authStore';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Omit<Project, 'id'>) => void;
}

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const { addTask } = useTaskStore();
  const { employees } = useEmployeeStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    customer: '',
    name: '',
    deadline: '',
    priority: 'low',
    surveyAct: false,
    code: '',
    assignee: '',
    startDate: new Date().toISOString().split('T')[0],
    rdStatus: 'not_started',
    idStatus: 'not_started',
    toStatus: '',
    gipStatus: '',
    approvalStatus: '',
    customerDeliveryDate: '',
    notes: '',
    attachments: []
  });

  // Filter engineers for the assignee dropdown
  const engineers = employees.filter(emp => emp.role === 'engineer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем проект
    const projectId = Math.random().toString(36).substr(2, 9);
    const projectData = { ...formData, id: projectId };
    
    // Генерируем и создаем задачи для проекта
    const tasks = generateProjectTasks(projectData);
    tasks.forEach(task => addTask(task));
    
    // Передаем данные проекта родительскому компоненту
    onSubmit(formData);
    onClose();
  };

  const handleFileUpload = (files: File[]) => {
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      uploadedBy: user?.name || '',
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">Создание нового проекта</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Заказчик</label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Наименование объекта</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Срок выполнения</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Приоритет</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'high' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="low">Обычный</option>
                  <option value="high">Срочно</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Шифр проекта</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Исполнитель</label>
                <div className="mt-1 flex space-x-2">
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Выберите исполнителя</option>
                    {engineers.map(engineer => (
                      <option key={engineer.id} value={engineer.name}>
                        {engineer.name} - {engineer.position}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    placeholder="Или введите вручную"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Обследование (АКТ)</label>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.surveyAct}
                      onChange={(e) => setFormData({ ...formData, surveyAct: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Есть</span>
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Примечания</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Прикрепить файлы
                </label>
                <DocumentUpload onUpload={handleFileUpload} />
                
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Прикрепленные файлы:</h4>
                    <ul className="space-y-2">
                      {formData.attachments.map(file => (
                        <li key={file.id} className="text-sm text-gray-600">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}