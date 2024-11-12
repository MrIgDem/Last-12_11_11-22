import React from 'react';
import { useResourceStore } from '../../store/resourceStore';
import { ResourceAllocation } from '../../types/resource';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface ResourceAllocationListProps {
  resourceId?: string;
  projectId?: string;
}

export function ResourceAllocationList({ resourceId, projectId }: ResourceAllocationListProps) {
  const { getAllocationsByResource, getAllocationsByProject } = useResourceStore();

  const allocations = resourceId 
    ? getAllocationsByResource(resourceId)
    : projectId 
    ? getAllocationsByProject(projectId)
    : [];

  const getStatusColor = (status: ResourceAllocation['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: ResourceAllocation['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <AlertCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Распределение ресурсов
      </h3>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {allocations.map((allocation) => (
            <li key={allocation.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getPriorityIcon(allocation.priority)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {allocation.resourceId}
                    </p>
                    {allocation.taskId && (
                      <p className="text-sm text-gray-500">
                        Задача: {allocation.taskId}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(allocation.status)
                }`}>
                  {allocation.status}
                </span>
              </div>

              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex sm:space-x-4">
                  <p className="flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {new Date(allocation.startDate).toLocaleDateString('ru-RU')} - {new Date(allocation.endDate).toLocaleDateString('ru-RU')}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Количество: {allocation.quantity}
                  </p>
                </div>
              </div>

              {allocation.notes && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {allocation.notes}
                  </p>
                </div>
              )}
            </li>
          ))}

          {allocations.length === 0 && (
            <li className="px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-500 text-center">
                Нет активных распределений
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}