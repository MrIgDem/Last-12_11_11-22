import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { MetricCard } from './MetricCard';
import { ChartContainer } from './ChartContainer';
import { ReportList } from './ReportList';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function AnalyticsDashboard() {
  const { metrics, charts, reports, updateMetrics, updateChartData } = useAnalyticsStore();

  useEffect(() => {
    updateMetrics();
    updateChartData('project-status');
    updateChartData('task-progress');
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Project Status Chart */}
        <ChartContainer title="Статус проектов">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.find(c => c.id === 'project-status')?.data || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(charts.find(c => c.id === 'project-status')?.data || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Task Progress Chart */}
        <ChartContainer title="Прогресс выполнения задач">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.find(c => c.id === 'task-progress')?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" name="Завершено" stroke="#8884d8" />
                <Line type="monotone" dataKey="in_progress" name="В работе" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Resource Utilization */}
        <ChartContainer title="Использование ресурсов">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Инженеры', total: 100, used: 75 },
                { name: 'Монтажники', total: 100, used: 60 },
                { name: 'Оборудование', total: 100, used: 90 },
                { name: 'Материалы', total: 100, used: 45 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" stackId="a" fill="#82ca9d" name="Использовано" />
                <Bar dataKey="total" stackId="a" fill="#8884d8" name="Всего" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Reports */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Отчеты
          </h3>
          <ReportList reports={reports} />
        </div>
      </div>
    </div>
  );
}