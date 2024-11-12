import React, { useState } from 'react';
import { useSafetyStore } from '../../store/safetyStore';
import { SafetyIncident } from '../../types/safety';
import { AlertTriangle, Search, Filter, ChevronDown, FileText } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export function IncidentList() {
  const { incidents, searchIncidents, getIncidentsBySeverity } = useSafetyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);

  const filteredIncidents = selectedSeverity === 'all' 
    ? searchIncidents(searchQuery)
    : getIncidentsBySeverity(selectedSeverity as SafetyIncident['severity']).filter(
        incident => incident.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getSeverityColor = (severity: SafetyIncident['severity']) => {
    switch (severity) {
      case 'minor': return 'bg-gray-100 text-gray-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'major': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'fatal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: SafetyIncident['status']) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
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
              placeholder="Поиск инцидентов..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Все уровни серьезности</option>
              <option value="minor">Незначительный</option>
              <option value="moderate">Умеренный</option>
              <option value="major">Серьезный</option>
              <option value="critical">Критический</option>
              <option value="fatal">Фатальный</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredIncidents.map((incident) => (
            <li key={incident.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                      incident.severity === 'critical' || incident.severity === 'fatal'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`} />
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {incident.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                    <button
                      onClick={() => setExpandedIncident(
                        expandedIncident === incident.id ? null : incident.id
                      )}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${
                        expandedIncident === incident.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {incident.location}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Дата: {formatDate(incident.date)}
                    </p>
                  </div>
                </div>

                {expandedIncident === incident.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Вовлеченные лица
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="list-disc pl-5">
                            {incident.involvedPersons.map((person) => (
                              <li key={person.id}>
                                {person.name} - {person.role}
                                {person.injury && ` (${person.injury})`}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Немедленные действия
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {incident.immediateActions}
                        </dd>
                      </div>

                      {incident.rootCause && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Основная причина
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.rootCause}
                          </dd>
                        </div>
                      )}

                      {incident.correctiveActions.length > 0 && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Корректирующие действия
                          </dt>
                          <dd className="mt-1">
                            <ul className="divide-y divide-gray-200">
                              {incident.correctiveActions.map((action) => (
                                <li key={action.id} className="py-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-900">
                                      {action.description}
                                    </p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      action.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : action.status === 'in_progress'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {action.status}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Ответственный: {action.assignee} | 
                                    Срок: {formatDate(action.deadline)}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}

                      {incident.attachments && incident.attachments.length > 0 && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Прикрепленные файлы
                          </dt>
                          <dd className="mt-1">
                            <ul className="divide-y divide-gray-200">
                              {incident.attachments.map((file) => (
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
                          </dd>
                        </div>
                      )}
                    </dl>
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