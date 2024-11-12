import React from 'react';
import { Schedule, Resource } from '../../types/calendar';

interface ResourceViewProps {
  schedule: Schedule | null;
  date: Date;
}

export function ResourceView({ schedule, date }: ResourceViewProps) {
  if (!schedule) return null;

  const getResourceUtilization = (resource: Resource) => {
    const availability = resource.availability.find(a => {
      const startDate = new Date(a.startDate);
      const endDate = new Date(a.endDate);
      return startDate <= date && endDate >= date;
    });

    if (!availability) return 0;

    const assignedTasks = schedule.tasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return (
        taskStart <= date &&
        taskEnd >= date &&
        task.resources.some(r => r.resourceId === resource.id)
      );
    });

    const totalAssigned = assignedTasks.reduce((sum, task) => {
      const resourceAssignment = task.resources.find(r => r.resourceId === resource.id);
      return sum + (resourceAssignment?.quantity || 0);
    }, 0);

    return (totalAssigned / availability.quantity) * 100;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="space-y-6">
          {schedule.resources.map(resource => {
            const utilization = getResourceUtilization(resource);
            
            return (
              <div
                key={resource.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {resource.type === 'team' ? 'Команда' :
                       resource.type === 'equipment' ? 'Оборудование' : 'Материал'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    utilization > 90 ? 'bg-red-100 text-red-800' :
                    utilization > 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {Math.round(utilization)}% загрузка
                  </span>
                </div>

                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${utilization}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          utilization > 90 ? 'bg-red-500' :
                          utilization > 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Доступность</p>
                    <p className="text-sm font-medium text-gray-900">
                      {resource.capacity} {resource.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Стоимость</p>
                    <p className="text-sm font-medium text-gray-900">
                      {resource.cost} ₽/{resource.unit}
                    </p>
                  </div>
                </div>

                {resource.availability.map((period, index) => (
                  <div key={index} className="mt-2 text-sm text-gray-500">
                    {new Date(period.startDate).toLocaleDateString('ru-RU')} - {' '}
                    {new Date(period.endDate).toLocaleDateString('ru-RU')}:{' '}
                    {period.quantity} {resource.unit}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}