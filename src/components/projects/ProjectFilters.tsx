import React from 'react';
import { ProjectType, DocumentStatus } from '../../types/project';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface ProjectFiltersProps {
  type: ProjectType | 'all';
  status: DocumentStatus | 'all';
  search: string;
  onTypeChange: (type: ProjectType | 'all') => void;
  onStatusChange: (status: DocumentStatus | 'all') => void;
  onSearchChange: (search: string) => void;
}

export function ProjectFilters({
  type,
  status,
  search,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: ProjectFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Поиск проектов..."
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="min-w-[150px]">
            <select
              value={type}
              onChange={(e) => onTypeChange(e.target.value as ProjectType | 'all')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">Все типы</option>
              <option value="b2b">B2B</option>
              <option value="b2c">B2C</option>
              <option value="government">Госзаказ</option>
            </select>
          </div>

          <div className="min-w-[150px]">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as DocumentStatus | 'all')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">Все статусы</option>
              <option value="not_started">Не начат</option>
              <option value="in_progress">В работе</option>
              <option value="review">На проверке</option>
              <option value="revision">На доработке</option>
              <option value="approved">Согласован</option>
              <option value="completed">Завершен</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}