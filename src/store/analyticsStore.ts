import { create } from 'zustand';
import { AnalyticsStore, Metric, ChartData, Report, MetricPeriod } from '../types/analytics';
import { useProjectStore } from './projectStore';
import { useTaskStore } from './taskStore';
import { useEmployeeStore } from './employeeStore';

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  metrics: [],
  charts: [],
  reports: [],
  isLoading: false,
  error: null,

  getMetrics: (period) => {
    const projectStore = useProjectStore.getState();
    const taskStore = useTaskStore.getState();
    const employeeStore = useEmployeeStore.getState();

    const activeProjects = projectStore.projects.filter(p => 
      p.rdStatus !== 'completed' && p.idStatus !== 'completed'
    ).length;

    const completedTasks = taskStore.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = taskStore.tasks.length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const employeeUtilization = employeeStore.employees.length > 0 ? 
      (employeeStore.employees.filter(e => e.role === 'engineer' || e.role === 'installer').length / employeeStore.employees.length) * 100 : 0;

    const metrics: Metric[] = [
      {
        id: 'active-projects',
        name: 'Активные проекты',
        value: activeProjects,
        type: 'count',
        period,
        trend: 0,
      },
      {
        id: 'task-completion',
        name: 'Выполнение задач',
        value: taskCompletionRate,
        type: 'percentage',
        period,
        trend: 5,
      },
      {
        id: 'employee-utilization',
        name: 'Загрузка персонала',
        value: employeeUtilization,
        type: 'percentage',
        period,
        trend: 2,
      },
      {
        id: 'project-efficiency',
        name: 'Эффективность',
        value: taskCompletionRate * (employeeUtilization / 100),
        type: 'percentage',
        period,
        trend: 3,
      }
    ];

    return metrics;
  },

  updateMetrics: async () => {
    set({ isLoading: true });
    try {
      const metrics = get().getMetrics('month');
      set({ metrics, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update metrics', isLoading: false });
    }
  },

  getChartData: (chartId, period) => {
    const projectStore = useProjectStore.getState();
    const taskStore = useTaskStore.getState();

    const charts: Record<string, () => ChartData> = {
      'project-status': () => {
        const projects = projectStore.projects;
        return {
          id: 'project-status',
          type: 'pie',
          title: 'Статус проектов',
          data: [
            { 
              name: 'В работе', 
              value: projects.filter(p => p.rdStatus === 'in_progress' || p.idStatus === 'in_progress').length 
            },
            { 
              name: 'Завершены', 
              value: projects.filter(p => p.rdStatus === 'completed' && p.idStatus === 'completed').length 
            },
            { 
              name: 'На проверке', 
              value: projects.filter(p => p.rdStatus === 'review' || p.idStatus === 'review').length 
            }
          ],
          series: [{ name: 'Проекты', key: 'value' }],
        };
      },
      'task-progress': () => {
        const tasks = taskStore.tasks;
        const today = new Date();
        const data = [];

        // Generate data for the last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
            return taskDate === dateStr;
          });

          data.push({
            date: dateStr,
            completed: dayTasks.filter(t => t.status === 'completed').length,
            in_progress: dayTasks.filter(t => t.status === 'in_progress').length,
          });
        }

        return {
          id: 'task-progress',
          type: 'line',
          title: 'Прогресс выполнения задач',
          data,
          series: [
            { name: 'Завершено', key: 'completed' },
            { name: 'В работе', key: 'in_progress' },
          ],
        };
      },
    };

    return charts[chartId]?.() || null;
  },

  updateChartData: async (chartId) => {
    set({ isLoading: true });
    try {
      const chartData = get().getChartData(chartId, 'month');
      if (chartData) {
        set(state => ({
          charts: [...state.charts.filter(c => c.id !== chartId), chartData],
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update chart data', isLoading: false });
    }
  },

  generateReport: async (type, parameters) => {
    try {
      const report: Report = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Отчет по ${type}`,
        type,
        format: 'pdf',
        generatedAt: new Date().toISOString(),
        url: '#',
        parameters,
      };

      set(state => ({
        reports: [...state.reports, report],
        isLoading: false,
      }));

      return report.url;
    } catch (error) {
      set({ error: 'Failed to generate report', isLoading: false });
      throw error;
    }
  },

  getReports: () => {
    return get().reports;
  },

  deleteReport: (id) => {
    set(state => ({
      reports: state.reports.filter(r => r.id !== id),
    }));
  },
}));