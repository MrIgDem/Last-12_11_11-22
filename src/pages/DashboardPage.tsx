import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardCards } from '../components/analytics/DashboardCards';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { Calendar } from '../components/calendar/Calendar';
import { NotificationCenter } from '../components/notifications/NotificationCenter';
import { useAuthStore } from '../store/authStore';

export function DashboardPage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Панель управления</h1>
          <NotificationCenter />
        </div>
        
        <DashboardCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Календарь</h2>
            <Calendar />
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Активные проекты</h2>
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}