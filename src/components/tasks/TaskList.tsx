import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

export function TaskList({ tasks, onStatusChange, onTaskClick }: TaskListProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <AlertCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li 
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="cursor-pointer"
          >
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    {getPriorityIcon(task.priority)}
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {task.title}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-5 w-5 mr-1.5" />
                    <span>{task.deadline}</span>
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onStatusChange(task.id, e.target.value as TaskStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершена</option>
                    <option value="blocked">Заблокирована</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Проект: {task.project}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>Исполнитель: {task.assignee}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}