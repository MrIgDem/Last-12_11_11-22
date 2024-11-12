import React from 'react';
import { DocumentType } from '../../types/document';

interface DocumentFiltersProps {
  onFilterChange: (filters: {
    type?: 'RD' | 'ID';
    status?: string;
    documentType?: DocumentType;
  }) => void;
}

export function DocumentFilters({ onFilterChange }: DocumentFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        onChange={(e) => onFilterChange({ type: e.target.value as 'RD' | 'ID' })}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        defaultValue=""
      >
        <option value="">Все типы</option>
        <option value="RD">РД</option>
        <option value="ID">ИД</option>
      </select>

      <select
        onChange={(e) => onFilterChange({ status: e.target.value })}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        defaultValue=""
      >
        <option value="">Все статусы</option>
        <option value="draft">Черновик</option>
        <option value="review">На проверке</option>
        <option value="approved">Утверждено</option>
        <option value="archived">В архиве</option>
      </select>

      <select
        onChange={(e) => onFilterChange({ documentType: e.target.value as DocumentType })}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        defaultValue=""
      >
        <option value="">Все документы</option>
        <option value="passport">Паспорта</option>
        <option value="scheme">Схемы</option>
        <option value="plan">Планы</option>
        <option value="protocol">Протоколы</option>
        <option value="act">Акты</option>
        <option value="certificate">Сертификаты</option>
        <option value="report">Отчеты</option>
        <option value="verification">Поверки</option>
      </select>
    </div>
  );
}