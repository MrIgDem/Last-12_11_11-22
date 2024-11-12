import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TaskList } from '../components/tasks/TaskList';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskDetails } from '../components/tasks/TaskDetails';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { Plus, Search } from 'lucide-react';
import { Task, TaskStatus } from '../types/task';

export function TasksPage() {
  const { user, logout } = useAuthStore();
  const { tasks, updateTask, addTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!user) return null;

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Задачи</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Новая задача
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Поиск задач..."
              />
            </div>
          </div>
        </div>

        <TaskList 
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onTaskClick={handleTaskClick}
        />

        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(taskData) => {
            addTask({ ...taskData, status: 'new' });
          }}
        />

        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}