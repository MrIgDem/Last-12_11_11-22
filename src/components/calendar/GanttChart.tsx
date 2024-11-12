import React from 'react';
import { Schedule, ScheduleTask } from '../../types/calendar';

interface GanttChartProps {
  schedule: Schedule | null;
}

export function GanttChart({ schedule }: GanttChartProps) {
  if (!schedule) return null;

  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const getTaskPosition = (task: ScheduleTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const left = Math.ceil((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const width = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      left: (left / totalDays) * 100,
      width: (width / totalDays) * 100,
    };
  };

  const getTaskColor = (task: ScheduleTask) => {
    if (task.criticalPath) return 'bg-red-500';
    switch (task.status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'delayed': return 'bg-red-300';
      case 'on_hold': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="relative">
          {/* Timeline header */}
          <div className="flex border-b">
            <div className="w-1/4 py-2 px-4 font-medium text-gray-700">
              Задача
            </div>
            <div className="w-3/4 relative">
              <div className="absolute inset-0 flex">
                {Array.from({ length: totalDays }).map((_, index) => {
                  const date = new Date(startDate);
                  date.setDate(date.getDate() + index);
                  return (
                    <div
                      key={index}
                      className="flex-1 border-l text-center text-xs text-gray-500"
                      style={{ maxWidth: '30px' }}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="relative">
            {schedule.tasks.map((task, index) => {
              const { left, width } = getTaskPosition(task);
              
              return (
                <div
                  key={task.id}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="w-1/4 py-2 px-4">
                    <p className="text-sm font-medium text-gray-900">
                      {task.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.duration} дней
                    </p>
                  </div>
                  <div className="w-3/4 h-8 relative">
                    <div
                      className={`absolute h-6 rounded ${getTaskColor(task)} hover:opacity-75 transition-opacity cursor-pointer`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        top: '4px',
                      }}
                      title={`${task.name} (${task.progress}%)`}
                    >
                      <div
                        className="h-full bg-black bg-opacity-20"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    
                    {/* Dependencies */}
                    {task.dependencies.map(dep => (
                      <div
                        key={dep.id}
                        className="absolute h-px bg-gray-300"
                        style={{
                          // Здесь должна быть логика отрисовки зависимостей
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}