import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ClipboardList, Users, Activity } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useEmployeeStore } from '../../store/employeeStore';

export function DashboardCards() {
  const navigate = useNavigate();
  const { projects } = useProjectStore();
  const { tasks } = useTaskStore();
  const { employees } = useEmployeeStore();

  // Calculate active projects (not completed)
  const activeProjects = projects.filter(
    project => project.rdStatus !== 'completed'
  ).length;

  // Calculate current tasks (new and in progress)
  const currentTasks = tasks.filter(
    task => task.status === 'new' || task.status === 'in_progress'
  ).length;

  // Calculate completion percentage for the month
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  const recentTasks = tasks.filter(task => 
    new Date(task.createdAt) >= monthAgo
  );
  
  const completedTasksPercent = recentTasks.length > 0
    ? Math.round((recentTasks.filter(task => task.status === 'completed').length / recentTasks.length) * 100)
    : 0;

  const cards = [
    {
      title: 'Активные проекты',
      value: activeProjects.toString(),
      icon: Briefcase,
      color: 'bg-indigo-100 text-indigo-800',
      onClick: () => navigate('/projects'),
    },
    {
      title: 'Текущие задачи',
      value: currentTasks.toString(),
      icon: ClipboardList,
      color: 'bg-blue-100 text-blue-800',
      onClick: () => navigate('/tasks'),
    },
    {
      title: 'Сотрудники',
      value: employees.length.toString(),
      icon: Users,
      color: 'bg-green-100 text-green-800',
      onClick: () => navigate('/employees'),
    },
    {
      title: 'Выполнено за месяц',
      value: `${completedTasksPercent}%`,
      icon: Activity,
      color: 'bg-yellow-100 text-yellow-800',
      onClick: () => navigate('/tasks'),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.title}
          onClick={card.onClick}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-lg transition-shadow duration-200 sm:px-6"
        >
          <dt>
            <div className={`absolute rounded-md p-3 ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {card.title}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
          </dd>
        </button>
      ))}
    </div>
  );
}