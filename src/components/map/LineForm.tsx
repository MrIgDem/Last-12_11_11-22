import React, { useState } from 'react';
import { useMapStore } from '../../store/mapStore';
import { FiberLine } from '../../types/map';
import { X } from 'lucide-react';

interface LineFormProps {
  onClose: () => void;
}

export function LineForm({ onClose }: LineFormProps) {
  const { points, addLine } = useMapStore();
  const [formData, setFormData] = useState<Omit<FiberLine, 'id'>>({
    points: [],
    type: 'underground',
    length: 0,
    fiberCount: 0,
    status: 'planned'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.points.length < 2) return;
    addLine(formData);
    onClose();
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-6 z-10 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Добавить линию</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Начальная точка</label>
          <select
            value={formData.points[0] || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              points: [e.target.value, formData.points[1] || '']
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Выберите точку</option>
            {points.map(point => (
              <option key={point.id} value={point.id}>{point.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Конечная точка</label>
          <select
            value={formData.points[1] || ''}
            onChange={(e) => setFormData({
              ...formData,
              points: [formData.points[0] || '', e.target.value]
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Выберите точку</option>
            {points
              .filter(point => point.id !== formData.points[0])
              .map(point => (
                <option key={point.id} value={point.id}>{point.name}</option>
              ))
            }
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Тип прокладки</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as FiberLine['type'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="underground">Подземный</option>
            <option value="aerial">Воздушный</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Длина (м)</label>
          <input
            type="number"
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Количество волокон</label>
          <input
            type="number"
            value={formData.fiberCount}
            onChange={(e) => setFormData({ ...formData, fiberCount: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Статус</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as FiberLine['status'] })}
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