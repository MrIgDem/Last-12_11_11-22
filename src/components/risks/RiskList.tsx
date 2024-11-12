import React, { useState } from 'react';
import { useRiskStore } from '../../store/riskStore';
import { Risk, RiskAssessment } from '../../types/risk';
import { AlertTriangle, Search, Filter, ChevronDown, FileText } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export function RiskList() {
  const { risks, searchRisks, getRisksByCategory } = useRiskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  const filteredRisks = selectedCategory === 'all' 
    ? searchRisks(searchQuery)
    : getRisksByCategory(selectedCategory as Risk['category']).filter(
        risk => risk.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getPriorityColor = (priority: RiskAssessment['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Risk['status']) => {
    switch (status) {
      case 'identified': return 'bg-blue-100 text-blue-800';
      case 'assessed': return 'bg-yellow-100 text-yellow-800';
      case 'mitigated': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'materialized': return 'bg-red-100 text-red-800';
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
              placeholder="Поиск рисков..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Все категории</option>
              <option value="technical">Технические</option>
              <option value="schedule">График</option>
              <option value="cost">Стоимость</option>
              <option value="quality">Качество</option>
              <option value="safety">Безопасность</option>
              <option value="environmental">Экологические</option>
              <option value="legal">Юридические</option>
              <option value="other">Прочие</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRisks.map((risk) => (
            <li key={risk.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                      risk.currentAssessment?.priority === 'critical' || 
                      risk.currentAssessment?.priority === 'high'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`} />
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {risk.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {risk.currentAssessment && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getPriorityColor(risk.currentAssessment.priority)
                      }`}>
                        {risk.currentAssessment.priority}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(risk.status)
                    }`}>
                      {risk.status}
                    </span>
                    <button
                      onClick={() => setExpandedRisk(
                        expandedRisk === risk.id ? null : risk.id
                      )}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${
                        expandedRisk === risk.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Категория: {risk.category}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Владелец: {risk.owner}
                    </p>
                  </div>
                </div>

                {expandedRisk === risk.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Описание
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {risk.description}
                        </dd>
                      </div>

                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Триггер
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {risk.trigger}
                        </dd>
                      </div>

                      {risk.currentAssessment && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Текущая оценка
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="font-medium">Вероятность</p>
                                <p>{risk.currentAssessment.probability}</p>
                              </div>
                              <div>
                                <p className="font-medium">Влияние</p>
                                <p>{risk.currentAssessment.impact}</p>
                              </div>
                              <div>
                                <p className="font-medium">Приоритет</p>
                                <p>{risk.currentAssessment.priority}</p>
                              </div>
                            </div>
                          </dd>
                        </div>
                      )}

                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          План снижения риска
                        </dt>
                        <dd className="mt-1">
                          <p className="text-sm text-gray-900 mb-2">
                            Стратегия: {risk.mitigationPlan.strategy}
                          </p>
                          {risk.mitigationPlan.actions.length > 0 && (
                            <ul className="divide-y divide-gray-200">
                              {risk.mitigationPlan.actions.map((action) => (
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
                                    Ответственный: {action.responsiblePerson} | 
                                    Срок: {formatDate(action.deadline)}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </dd>
                      </div>

                      {risk.attachments && risk.attachments.length > 0 && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Прикрепленные файлы
                          </dt>
                          <dd className="mt-1">
                            <ul className="divide-y divide-gray-200">
                              {risk.attachments.map((file) => (
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