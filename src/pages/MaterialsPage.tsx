import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useMaterialStore } from '../store/materialStore';
import { Material } from '../types/material';
import { Package, FileText, Plus, Trash2 } from 'lucide-react';

export function MaterialsPage() {
  const { user, logout } = useAuthStore();
  const { materials, addMaterial, removeMaterial } = useMaterialStore();
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Omit<Material, 'id' | 'createdAt'>>({
    name: '',
    manufacturer: '',
    type: '',
    productionDate: '',
    expiryDate: '',
    specifications: '',
  });

  if (!user) return null;

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterial(newMaterial);
    setNewMaterial({
      name: '',
      manufacturer: '',
      type: '',
      productionDate: '',
      expiryDate: '',
      specifications: '',
    });
    setIsAddingMaterial(false);
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Материалы</h1>
          <button
            onClick={() => setIsAddingMaterial(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добавить материал
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-6 w-6 text-gray-400 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {material.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeMaterial(material.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Производитель: {material.manufacturer}
                  </p>
                  <p className="text-sm text-gray-500">
                    Тип: {material.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Дата производства: {new Date(material.productionDate).toLocaleDateString('ru-RU')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Срок годности: {new Date(material.expiryDate).toLocaleDateString('ru-RU')}
                  </p>
                  {material.specifications && (
                    <p className="mt-2 text-sm text-gray-700">
                      {material.specifications}
                    </p>
                  )}
                </div>
                {material.certificateUrl && (
                  <div className="mt-4">
                    <a
                      href={material.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Сертификат
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {isAddingMaterial && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsAddingMaterial(false)} />
              
              <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Добавить материал
                </h3>

                <form onSubmit={handleAddMaterial} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Название
                    </label>
                    <input
                      type="text"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial,
                        name: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Производитель
                    </label>
                    <input
                      type="text"
                      value={newMaterial.manufacturer}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial,
                        manufacturer: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Тип
                    </label>
                    <input
                      type="text"
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial,
                        type: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Дата производства
                    </label>
                    <input
                      type="date"
                      value={newMaterial.productionDate}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial,
                        productionDate: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Срок годности
                    </label>
                    <input
                      type="date"
                      value={newMaterial.expiryDate}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial,
                        expiryDate: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Спецификации
                    </label>
                    <textarea
                      value={newMaterial.specifications}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial,
                        specifications: e.target.value,
                      })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingMaterial(false)}
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
    </DashboardLayout>
  );
}