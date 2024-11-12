import React, { useState } from 'react';
import { useRiskStore } from '../../store/riskStore';
import { Risk, RiskAssessment, MitigationAction } from '../../types/risk';
import { X, Plus, AlertTriangle } from 'lucide-react';
import { DocumentUpload } from '../documents/DocumentUpload';
import { useAuthStore } from '../../store/authStore';

interface RiskFormProps {
  projectId: string;
  onClose: () => void;
}

export function RiskForm({ projectId, onClose }: RiskFormProps) {
  const { user } = useAuthStore();
  const { addRisk } = useRiskStore();
  const [formData, setFormData] = useState<Omit<Risk, 'id' | 'createdAt' | 'updatedAt'>>({
    projectId,
    category: 'technical',
    title: '',
    description: '',
    trigger: '',
    status: 'identified',
    owner: '',
    identifiedBy: user?.name || '',
    identifiedAt: new Date().toISOString(),
    assessments: [],
    mitigationPlan: {
      strategy: 'mitigate',
      actions: [],
    },
    monitoringHistory: [],
  });

  const [assessment, setAssessment] = useState<Omit<RiskAssessment, 'id'>>({
    probability: 'low',
    impact: 'minor',
    priority: 'low',
    assessedBy: user?.name || '',
    assessedAt: new Date().toISOString(),
  });

  const [action, setAction] = useState<Omit<MitigationAction, 'id'>>({
    type: 'preventive',
    description: '',
    responsiblePerson: '',
    deadline: '',
    status: 'planned',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Добавляем текущую оценку риска
    const riskData = {
      ...formData,
      assessments: [
        {
          ...assessment,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
      currentAssessment: {
        ...assessment,
        id: Math.random().toString(36).substr(2, 9),
      },
    };

    addRisk(riskData);
    onClose();
  };

  const handleAddAction = () => {
    if (action.description && action.responsiblePerson && action.deadline) {
      setFormData(prev => ({
        ...prev,
        mitigationPlan: {
          ...prev.mitigationPlan,
          actions: [
            ...prev.mitigationPlan.actions,
            {
              ...action,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        },
      }));
      setAction({
        type: 'preventive',
        description: '',
        responsiblePerson: '',
        deadline: '',
        status: 'planned',
      });
    }
  };

  const handleFileUpload = (files: File[]) => {
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Добавление риска
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Категория риска
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Risk['category'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="technical">Технический</option>
                  <option value="schedule">График</option>
                  <option value="cost">Стоимость</option>
                  <option value="quality">Качество</option>
                  <option value="safety">Безопасность</option>
                  <option value="environmental">Экологический</option>
                  <option value="legal">Юридический</option>
                  <option value="other">Прочее</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Владелец риска
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Название риска
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Триггер
                </label>
                <textarea
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Оценка риска
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Вероятность
                    </label>
                    <select
                      value={assessment.probability}
                      onChange={(e) => setAssessment({ 
                        ...assessment, 
                        probability: e.target.value as RiskAssessment['probability'],
                        priority: calculatePriority(e.target.value as RiskAssessment['probability'], assessment.impact)
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="very_low">Очень низкая</option>
                      <option value="low">Низкая</option>
                      <option value="medium">Средняя</option>
                      <option value="high">Высокая</option>
                      <option value="very_high">Очень высокая</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Влияние
                    </label>
                    <select
                      value={assessment.impact}
                      onChange={(e) => setAssessment({ 
                        ...assessment, 
                        impact: e.target.value as RiskAssessment['impact'],
                        priority: calculatePriority(assessment.probability, e.target.value as RiskAssessment['impact'])
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="negligible">Незначительное</option>
                      <option value="minor">Слабое</option>
                      <option value="moderate">Умеренное</option>
                      <option value="major">Сильное</option>
                      <option value="severe">Критическое</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Приоритет
                    </label>
                    <div className={`mt-1 px-3 py-2 rounded-md text-sm font-medium ${
                      assessment.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      assessment.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      assessment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {assessment.priority === 'critical' ? 'Критический' :
                       assessment.priority === 'high' ? 'Высокий' :
                       assessment.priority === 'medium' ? 'Средний' :
                       'Низкий'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  План снижения риска
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Стратегия
                    </label>
                    <select
                      value={formData.mitigationPlan.strategy}
                      onChange={(e) => setFormData({
                        ...formData,
                        mitigationPlan: {
                          ...formData.mitigationPlan,
                          strategy: e.target.value as Risk['mitigationPlan']['strategy'],
                        },
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="avoid">Избежание</option>
                      <option value="transfer">Передача</option>
                      <option value="mitigate">Снижение</option>
                      <option value="accept">Принятие</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    {formData.mitigationPlan.actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1">{action.description}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            mitigationPlan: {
                              ...prev.mitigationPlan,
                              actions: prev.mitigationPlan.actions.filter((_, i) => i !== index),
                            },
                          }))}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <select
                          value={action.type}
                          onChange={(e) => setAction({ ...action, type: e.target.value as MitigationAction['type'] })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="preventive">Предупреждающее</option>
                          <option value="corrective">Корректирующее</option>
                          <option value="detective">Обнаруживающее</option>
                          <option value="contingency">Резервное</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={action.description}
                          onChange={(e) => setAction({ ...action, description: e.target.value })}
                          placeholder="Описание действия"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={action.responsiblePerson}
                          onChange={(e) => setAction({ ...action, responsiblePerson: e.target.value })}
                          placeholder="Ответственный"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={action.deadline}
                          onChange={(e) => setAction({ ...action, deadline: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Добавить действие
                    </button>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Прикрепить файлы
                </label>
                <DocumentUpload onUpload={handleFileUpload} />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Добавить риск
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function calculatePriority(
  probability: RiskAssessment['probability'], 
  impact: RiskAssessment['impact']
): RiskAssessment['priority'] {
  const probabilityScore = {
    very_low: 1,
    low: 2,
    medium: 3,
    high: 4,
    very_high: 5
  };

  const impactScore = {
    negligible: 1,
    minor: 2,
    moderate: 3,
    major: 4,
    severe: 5
  };

  const score = probabilityScore[probability] * impactScore[impact];

  if (score >= 20) return 'critical';
  if (score >= 12) return 'high';
  if (score >= 6) return 'medium';
  return 'low';
}