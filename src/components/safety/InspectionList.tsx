import React, { useState } from 'react';
import { useSafetyStore } from '../../store/safetyStore';
import { SafetyInspection, InspectionType } from '../../types/safety';
import { ClipboardCheck, Search, Filter, ChevronDown, FileText, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export function InspectionList() {
  const { inspections } = useSafetyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<InspectionType | 'all'>('all');
  const [expandedInspection, setExpandedInspection] = useState<string | null>(null);

  const filteredInspections = inspections
    .filter(inspection => 
      (selectedType === 'all' || inspection.type === selectedType) &&
      (inspection.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
       inspection.inspector.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getViolationSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getViolationStatusColor = (status: 'open' | 'in_progress' | 'resolved') => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Поиск инспекций..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as InspectionType | 'all')}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Все типы</option>
              <option value="daily">Ежедневные</option>
              <option value="weekly">Еженедельные</option>
              <option value="monthly">Ежемесячные</option>
              <option value="special">Специальные</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredInspections.map((inspection) => (
            <li key={inspection.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClipboardCheck className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {inspection.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        Инспектор: {inspection.inspector}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {inspection.type}
                    </span>
                    <button
                      onClick={() => setExpandedInspection(
                        expandedInspection === inspection.id ? null : inspection.id
                      )}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${
                        expandedInspection === inspection.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Дата: {formatDate(inspection.date)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Нарушений: {inspection.violations.length}
                    </p>
                  </div>
                </div>

                {expandedInspection === inspection.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Контрольный список
                        </h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {inspection.checklist.map((item) => (
                            <div
                              key={item.id}
                              className="border rounded-lg p-3 bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.category}
                                </p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === 'pass'
                                    ? 'bg-green-100 text-green-800'
                                    : item.status === 'fail'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">
                                {item.item}
                              </p>
                              {item.comments && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.comments}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {inspection.violations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Нарушения
                          </h4>
                          <div className="space-y-3">
                            {inspection.violations.map((violation) => (
                              <div
                                key={violation.id}
                                className="border rounded-lg p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <AlertCircle className={`h-5 w-5 mr-2 ${
                                      violation.severity === 'high'
                                        ? 'text-red-500'
                                        : violation.severity === 'medium'
                                        ? 'text-orange-500'
                                        : 'text-yellow-500'
                                    }`} />
                                    <p className="text-sm font-medium text-gray-900">
                                      {violation.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      getViolationSeverityColor(violation.severity)
                                    }`}>
                                      {violation.severity}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      getViolationStatusColor(violation.status)
                                    }`}>
                                      {violation.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                  <p>Ответственный: {violation.responsiblePerson}</p>
                                  <p>Корректирующее действие: {violation.correctiveAction}</p>
                                  <p>Срок: {formatDate(violation.deadline)}</p>
                                  {violation.resolvedAt && (
                                    <p>Устранено: {formatDate(violation.resolvedAt)}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {inspection.recommendations && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Рекомендации
                          </h4>
                          <p className="text-sm text-gray-600">
                            {inspection.recommendations}
                          </p>
                        </div>
                      )}

                      {inspection.attachments && inspection.attachments.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Прикрепленные файлы
                          </h4>
                          <ul className="divide-y divide-gray-200">
                            {inspection.attachments.map((file) => (
                              <li key={file.id} className="py-2">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                  <FileText className="h-5 w-5 mr-2" />
                                  {file.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}