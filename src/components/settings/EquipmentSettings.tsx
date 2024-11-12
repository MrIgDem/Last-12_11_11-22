import React, { useState } from 'react';
import { useEquipmentStore } from '../../store/equipmentStore';
import { Equipment, Verification, VerificationType } from '../../types/equipment';
import { Plus, Wrench, FileText, Trash2 } from 'lucide-react';
import { PdfUpload } from '../common/PdfUpload';

export function EquipmentSettings() {
  const { equipment, addEquipment, removeEquipment, addVerification } = useEquipmentStore();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id' | 'verifications'>>({
    name: '',
    type: '',
    serialNumber: '',
  });
  const [newVerification, setNewVerification] = useState<Omit<Verification, 'id' | 'createdAt'>>({
    equipmentId: '',
    type: 'calibration',
    date: '',
    nextDate: '',
    notes: '',
  });

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment(newEquipment);
    setNewEquipment({
      name: '',
      type: '',
      serialNumber: '',
    });
  };

  const handleAddVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEquipment) {
      addVerification({ ...newVerification, equipmentId: selectedEquipment.id });
      setNewVerification({
        equipmentId: '',
        type: 'calibration',
        date: '',
        nextDate: '',
        notes: '',
      });
      setSelectedEquipment(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Оборудование</h1>
        <button
          onClick={() => setSelectedEquipment(null)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить оборудование
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {equipment.map((eq) => (
          <div
            key={eq.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wrench className="h-6 w-6 text-gray-400 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">{eq.name}</h3>
                </div>
                <button
                  onClick={() => removeEquipment(eq.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Серийный номер: {eq.serialNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Тип: {eq.type}
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Поверки</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  {eq.verifications.map((v) => (
                    <li key={v.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {v.type === 'calibration' ? 'Калибровка' :
                             v.type === 'test' ? 'Тестирование' : 'Обслуживание'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(v.date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        {v.documentUrl && (
                          <a
                            href={v.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FileText className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedEquipment(eq)}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Добавить поверку
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEquipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedEquipment(null)} />
            
            <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Добавить поверку для {selectedEquipment.name}
              </h3>

              <form onSubmit={handleAddVerification} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Тип поверки
                  </label>
                  <select
                    value={newVerification.type}
                    onChange={(e) => setNewVerification({
                      ...newVerification,
                      type: e.target.value as VerificationType,
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="calibration">Калибровка</option>
                    <option value="test">Тестирование</option>
                    <option value="maintenance">Обслуживание</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Дата поверки
                  </label>
                  <input
                    type="date"
                    value={newVerification.date}
                    onChange={(e) => setNewVerification({
                      ...newVerification,
                      date: e.target.value,
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Следующая поверка
                  </label>
                  <input
                    type="date"
                    value={newVerification.nextDate}
                    onChange={(e) => setNewVerification({
                      ...newVerification,
                      nextDate: e.target.value,
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Примечания
                  </label>
                  <textarea
                    value={newVerification.notes}
                    onChange={(e) => setNewVerification({
                      ...newVerification,
                      notes: e.target.value,
                    })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Документ поверки
                  </label>
                  <div className="mt-1">
                    <PdfUpload
                      onFileSelect={(file) => console.log('Selected file:', file)}
                      label="Добавить документ"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEquipment(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Добавить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}