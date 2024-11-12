import React, { useState } from 'react';
import { useSafetyStore } from '../../store/safetyStore';
import { SafetyIncident } from '../../types/safety';
import { X, Plus, Upload } from 'lucide-react';
import { DocumentUpload } from '../documents/DocumentUpload';

interface IncidentFormProps {
  projectId: string;
  onClose: () => void;
}

export function IncidentForm({ projectId, onClose }: IncidentFormProps) {
  const { reportIncident } = useSafetyStore();
  const [formData, setFormData] = useState<Omit<SafetyIncident, 'id' | 'createdAt' | 'updatedAt'>>({
    projectId,
    date: new Date().toISOString().split('T')[0],
    location: '',
    severity: 'minor',
    type: '',
    description: '',
    involvedPersons: [],
    witnesses: [],
    immediateActions: '',
    correctiveActions: [],
    status: 'reported',
    reportedBy: '',
    attachments: [],
  });

  const [newPerson, setNewPerson] = useState({ name: '', role: '', injury: '' });
  const [newWitness, setNewWitness] = useState({ name: '', contact: '', statement: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportIncident(formData);
    onClose();
  };

  const handleAddPerson = () => {
    if (newPerson.name && newPerson.role) {
      setFormData(prev => ({
        ...prev,
        involvedPersons: [
          ...prev.involvedPersons,
          {
            ...newPerson,
            id: Math.random().toString(36).substr(2, 9),
          },
        ],
      }));
      setNewPerson({ name: '', role: '', injury: '' });
    }
  };

  const handleAddWitness = () => {
    if (newWitness.name && newWitness.contact) {
      setFormData(prev => ({
        ...prev,
        witnesses: [
          ...prev.witnesses,
          {
            ...newWitness,
            id: Math.random().toString(36).substr(2, 9),
          },
        ],
      }));
      setNewWitness({ name: '', contact: '', statement: '' });
    }
  };

  const handleFileUpload = (files: File[]) => {
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
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
            Сообщить об инциденте
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Дата инцидента
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Место
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Серьезность
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as SafetyIncident['severity'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="minor">Незначительный</option>
                  <option value="moderate">Умеренный</option>
                  <option value="major">Серьезный</option>
                  <option value="critical">Критический</option>
                  <option value="fatal">Фатальный</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Тип инцидента
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                  Немедленные действия
                </label>
                <textarea
                  value={formData.immediateActions}
                  onChange={(e) => setFormData({ ...formData, immediateActions: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Вовлеченные лица
                </h3>
                <div className="space-y-2">
                  {formData.involvedPersons.map((person, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1">{person.name} - {person.role}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          involvedPersons: prev.involvedPersons.filter((_, i) => i !== index),
                        }))}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newPerson.name}
                      onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                      placeholder="Имя"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={newPerson.role}
                      onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                      placeholder="Роль"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={newPerson.injury}
                      onChange={(e) => setNewPerson({ ...newPerson, injury: e.target.value })}
                      placeholder="Травма (если есть)"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddPerson}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Свидетели
                </h3>
                <div className="space-y-2">
                  {formData.witnesses.map((witness, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1">{witness.name} - {witness.contact}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          witnesses: prev.witnesses.filter((_, i) => i !== index),
                        }))}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newWitness.name}
                      onChange={(e) => setNewWitness({ ...newWitness, name: e.target.value })}
                      placeholder="Имя"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={newWitness.contact}
                      onChange={(e) => setNewWitness({ ...newWitness, contact: e.target.value })}
                      placeholder="Контакт"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddWitness}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-5 w-5" />
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
                Сообщить об инциденте
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}