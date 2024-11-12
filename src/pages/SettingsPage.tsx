import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { OrganizationSettings } from '../components/settings/OrganizationSettings';
import { EquipmentSettings } from '../components/settings/EquipmentSettings';
import { MaterialsSettings } from '../components/settings/MaterialsSettings';

export function SettingsPage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <Routes>
        <Route index element={<Navigate to="organization" replace />} />
        <Route path="organization" element={<OrganizationSettings />} />
        <Route path="equipment" element={<EquipmentSettings />} />
        <Route path="materials" element={<MaterialsSettings />} />
      </Routes>
    </DashboardLayout>
  );
}