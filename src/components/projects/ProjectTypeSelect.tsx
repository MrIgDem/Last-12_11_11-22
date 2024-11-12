import React from 'react';
import { ProjectType } from '../../types/project';
import { Building2, Users, Landmark } from 'lucide-react';

interface ProjectTypeSelectProps {
  value: ProjectType;
  onChange: (type: ProjectType) => void;
  className?: string;
}

export function ProjectTypeSelect({ value, onChange, className = '' }: ProjectTypeSelectProps) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => onChange('b2b')}
        className={`relative flex flex-col items-center justify-center p-4 border rounded-lg ${
          value === 'b2b'
            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Building2 className="h-6 w-6 mb-2" />
        <span className="text-sm font-medium">B2B</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('b2c')}
        className={`relative flex flex-col items-center justify-center p-4 border rounded-lg ${
          value === 'b2c'
            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Users className="h-6 w-6 mb-2" />
        <span className="text-sm font-medium">B2C</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('government')}
        className={`relative flex flex-col items-center justify-center p-4 border rounded-lg ${
          value === 'government'
            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Landmark className="h-6 w-6 mb-2" />
        <span className="text-sm font-medium">Госзаказ</span>
      </button>
    </div>
  );
}