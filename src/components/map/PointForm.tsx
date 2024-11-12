import React, { useState } from 'react';
import { useMapStore } from '../../store/mapStore';
import { GeoPoint } from '../../types/map';
import { X } from 'lucide-react';

interface PointFormProps {
  initialPosition?: { lat: number; lng: number };
  onClose: () => void;
}

export function PointForm({ initialPosition, onClose }: PointFormProps) {
  const { addPoint } = useMapStore();
  const [formData, setFormData] = useState<Omit<GeoPoint, 'id'>>({
    lat: initialPosition?.lat || 0,
    lng: initialPosition?.lng || 0,
    type: 'node',
    name: '',
    description: '',
    status: 'planned'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPoint(formData);
    onClose();
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-6 z-10 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Добавить точку</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Тип точки</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as GeoPoint['type'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="node">Узел связи</option>
            <option value="equipment">Оборудование</option>
            <option value="splice">Муфта</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Статус</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as GeoPoint['status'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="planned">Запланировано</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершено</option>
          </select>
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
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
}