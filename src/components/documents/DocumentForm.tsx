import React, { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { ProjectDocument } from '../../types/document';

interface DocumentFormProps {
  onSubmit: (data: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'files'>) => void;
  onCancel: () => void;
}

export function DocumentForm({ onSubmit, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    type: 'RD' as const,
    code: '',
    name: '',
    status: 'draft' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Тип документации
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'RD' | 'ID' }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="RD">Рабочая документация (РД)</option>
          <option value="ID">Исполнительная документация (ИД)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Шифр проекта
        </label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Наименование
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Создать документ
        </button>
      </div>
    </form>
  );
}