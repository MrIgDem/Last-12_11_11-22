import React from 'react';
import { Schedule, ScheduleTask } from '../../types/calendar';

interface TaskTimelineProps {
  schedule: Schedule | null;
  date: Date;
}

export function TaskTimeline({ schedule, date }: TaskTimelineProps) {
  if (!schedule) return null;

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const tasksInRange = schedule.tasks.filter(task => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    return taskStart <= endOfMonth && taskEnd >= startOfMonth;
  });

  const getTaskStatus = (task: ScheduleTask) => {
    if (task.status === 'completed') return 'bg-green-100 text-green-800';
    if (task.status === 'in_progress') return 'bg-yellow-100 text-yellow-800';
    if (task.status === 'delayed') return 'bg-red-100 text-red-800';
    if (task.status === 'on_hold') return 'bg-gray-100 text-gray-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="space-y-6">
          {tasksInRange.map(task => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {task.name}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskStatus(task)}`}>
                  {task.status}
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Начало</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(task.startDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Окончание</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(task.endDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        Прогресс
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div
                      style={{ width: `${task.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {task.resources.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Ресурсы</p>
                  <div className="flex flex-wrap gap-2">
                    {task.resources.map((resource, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {resource.resourceId} ({resource.quantity})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}