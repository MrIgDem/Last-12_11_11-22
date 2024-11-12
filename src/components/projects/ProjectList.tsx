import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { ProjectTable } from './ProjectTable';

export function ProjectList() {
  const { projects } = useProjectStore();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ProjectTable />
        </div>
      </div>
    </div>
  );
}