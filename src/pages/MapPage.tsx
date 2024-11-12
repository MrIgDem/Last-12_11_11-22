import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProjectMap } from '../components/map/ProjectMap';
import { MapControls } from '../components/map/MapControls';
import { PointForm } from '../components/map/PointForm';
import { LineForm } from '../components/map/LineForm';
import { useAuthStore } from '../store/authStore';
import { useMapStore } from '../store/mapStore';

export function MapPage() {
  const { user, logout } = useAuthStore();
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isAddingLine, setIsAddingLine] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

  if (!user) return null;

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    if (isAddingPoint) {
      setSelectedPosition(latlng);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Карта объектов</h1>
        </div>

        <div className="relative bg-white shadow rounded-lg overflow-hidden">
          <MapControls
            onAddPoint={() => {
              setIsAddingPoint(true);
              setIsAddingLine(false);
            }}
            onAddLine={() => {
              setIsAddingLine(true);
              setIsAddingPoint(false);
            }}
          />

          <ProjectMap onMapClick={handleMapClick} />

          {isAddingPoint && selectedPosition && (
            <PointForm
              initialPosition={selectedPosition}
              onClose={() => {
                setIsAddingPoint(false);
                setSelectedPosition(null);
              }}
            />
          )}

          {isAddingLine && (
            <LineForm
              onClose={() => {
                setIsAddingLine(false);
              }}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}