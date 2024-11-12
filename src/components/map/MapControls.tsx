import React from 'react';
import { MapPin, GitBranch } from 'lucide-react';

interface MapControlsProps {
  onAddPoint: () => void;
  onAddLine: () => void;
}

export function MapControls({ onAddPoint, onAddLine }: MapControlsProps) {
  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
      <div className="space-y-2">
        <button
          onClick={onAddPoint}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
          title="Добавить точку"
        >
          <MapPin className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={onAddLine}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
          title="Добавить линию"
        >
          <GitBranch className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}