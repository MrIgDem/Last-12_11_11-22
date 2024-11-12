import React, { useState } from 'react';
import { useEstimateStore } from '../../store/estimateStore';
import { CostItem } from '../../types/estimation';
import { X, Plus, Calculator } from 'lucide-react';
import { DocumentUpload } from '../documents/DocumentUpload';

interface EstimateFormProps {
  projectId: string;
  onClose: () => void;
}

export function EstimateForm({ projectId, onClose }: EstimateFormProps) {
  const { addEstimate } = useEstimateStore();
  const [formData, setFormData] = useState({
    projectId,
    name: '',
    number: '',
    status: 'draft' as const,
    items: [] as CostItem[],
    totalMaterialsCost: 0,
    totalWorksCost: 0,
    totalEquipmentCost: 0,
    totalOtherCost: 0,
    totalCost: 0,
    documents: [],
  });

  const [newItem, setNewItem] = useState<Omit<CostItem, 'id' | 'createdAt' | 'updatedAt'>>({
    projectId,
    type: 'material',
    code: '',
    name: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    status: 'draft',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEstimate(formData);
    onClose();
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity && newItem.unitPrice) {
      const totalPrice = newItem.quantity * newItem.unitPrice;
      const item = {
        ...newItem,
        totalPrice,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setFormData(prev => {
        const newItems = [...prev.items, item];
        const totals = calculateTotals(newItems);
        return { ...prev, items: newItems, ...totals };
      });

      setNewItem({
        projectId,
        type: 'material',
        code: '',
        name: '',
        unit: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        status: 'draft',
      });
    }
  };

  const calculateTotals = (items: CostItem[]) => {
    const totals = items.reduce(
      (acc, item) => {
        switch (item.type) {
          case 'material':
            acc.totalMaterialsCost += item.totalPrice;
            break;
          case 'work':
            acc.totalWorksCost += item.totalPrice;
            break;
          case 'equipment':
            acc.totalEquipmentCost += item.totalPrice;
            break;
          case 'other':
            acc.totalOtherCost += item.totalPrice;
            break;
        }
        return acc;
      },
      {
        totalMaterialsCost: 0,
        totalWorksCost: 0,
        totalEquipmentCost: 0,
        totalOtherCost: 0,
      }
    );

    return {
      ...totals,
      totalCost:
        totals.totalMaterialsCost +
        totals.totalWorksCost +
        totals.totalEquipmentCost +
        totals.totalOtherCost,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Создание сметы
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Название сметы
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Номер сметы
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Позиции сметы
              </h3>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'material'
                        ? 'bg-blue-100 text-blue-800'
                        : item.type === 'work'
                        ? 'bg-green-100 text-green-800'
                        : item.type === 'equipment'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => {
                        const newItems = prev.items.filter((_, i) => i !== index);
                        const totals = calculateTotals(newItems);
                        return { ...prev, items: newItems, ...totals };
                      })}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <select
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value as CostItem['type'] })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="material">Материал</option>
                      <option value="work">Работа</option>
                      <option value="equipment">Оборудование</option>
                      <option value="other">Прочее</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Наименование"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newItem.code}
                      onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                      placeholder="Код"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="Ед.изм."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                      placeholder="Кол-во"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                      placeholder="Цена"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex w-full items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Материалы</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatCurrency(formData.totalMaterialsCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Работы</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatCurrency(formData.totalWorksCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Оборудование</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatCurrency(formData.totalEquipmentCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Итого</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatCurrency(formData.totalCost)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Прикрепить документы
              </h3>
              <DocumentUpload onUpload={() => {}} />
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
                Создать смету
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}