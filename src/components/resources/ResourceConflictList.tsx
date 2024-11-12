import React from 'react';
import { useResourceStore } from '../../store/resourceStore';
import { ResourceConflict } from '../../types/resource';
import { AlertTriangle, Calendar, ArrowRight } from 'lucide-react';

interface ResourceConflictListProps {
  resourceId: string;
  startDate: string;
  endDate: string;
}

export function ResourceConflictList({ resourceId, startDate, endDate }: ResourceConflictListProps) {
  const { getResourceConflicts } = useResourceStore();
  const conflicts = getResourceConflicts(resourceId, startDate, endDate);

  const getConflictColor = (type: ResourceConflict['type']) => {
    switch (type) {
      case 'overallocation':
        return 'bg-red-100 text-red-800';
      case 'unavailable':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
        Конфликты ресурсов
      </h3>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {conflicts.map((conflict) => (
            <li key={`${conflict.resourceId}-${conflict.startDate}`} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getConflictColor(conflict.type)
                }`}>
                  {conflict.type === 'overallocation' ? 'Перегрузка' :
                   conflict.type === 'unavailable' ? 'Недоступен' : 'Обслуживание'}
                </span>
              </div>

              <div className="mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span>{new Date(conflict.startDate).toLocaleDateString('ru-RU')}</span>
                  <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
                  <span>{new Date(conflict.endDate).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Требуется: {conflict.requiredQuantity}, Доступно: {conflict.availableQuantity}
                </p>
              </div>

              {conflict.affectedAllocations.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Затронутые назначения:</p>
                  <ul className="mt-1 space-y-1">
                    {conflict.affectedAllocations.map((allocation) => (
                      <li key={allocation.id} className="text-sm text-gray-500">
                        Проект: {allocation.projectId}
                        {allocation.taskId && ` - Задача: ${allocation.taskId}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}

          {conflicts.length === 0 && (
            <li className="px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-500 text-center">
                Конфликтов не обнаружено
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}