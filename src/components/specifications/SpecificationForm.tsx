import React, { useState } from 'react';
import { useSpecificationStore } from '../../store/specificationStore';
import { MaterialItem, WorkItem } from '../../types/specification';
import { Plus, Trash2, FileSpreadsheet, FileText } from 'lucide-react';

interface SpecificationFormProps {
  projectId: string;
  onClose: () => void;
}

export function SpecificationForm({ projectId, onClose }: SpecificationFormProps) {
  const { addSpecification, addMaterialItem, addWorkItem } = useSpecificationStore();
  const [name, setName] = useState('');
  const [materials, setMaterials] = useState<Omit<MaterialItem, 'id'>[]>([]);
  const [works, setWorks] = useState<Omit<WorkItem, 'id'>[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const specification = {
      projectId,
      name,
      materials: [],
      works: [],
      totalMaterialsCost: 0,
      totalWorksCost: 0,
      totalCost: 0,
    };

    const specId = addSpecification(specification);
    
    materials.forEach(material => {
      addMaterialItem(specId, material);
    });

    works.forEach(work => {
      addWorkItem(specId, work);
    });

    onClose();
  };

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        name: '',
        type: 'cable',
        unit: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const addWork = () => {
    setWorks([
      ...works,
      {
        name: '',
        unit: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        category: 'installation',
      },
    ]);
  };

  const updateMaterial = (index: number, data: Partial<MaterialItem>) => {
    const newMaterials = [...materials];
    newMaterials[index] = {
      ...newMaterials[index],
      ...data,
      totalPrice: (data.quantity || materials[index].quantity) * 
                 (data.unitPrice || materials[index].unitPrice),
    };
    setMaterials(newMaterials);
  };

  const updateWork = (index: number, data: Partial<WorkItem>) => {
    const newWorks = [...works];
    newWorks[index] = {
      ...newWorks[index],
      ...data,
      totalPrice: (data.quantity || works[index].quantity) * 
                 (data.unitPrice || works[index].unitPrice),
    };
    setWorks(newWorks);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Название спецификации
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Материалы</h3>
          <button
            type="button"
            onClick={addMaterial}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить материал
          </button>
        </div>

        {materials.map((material, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 mb-4">
            <div className="col-span-2">
              <input
                type="text"
                value={material.name}
                onChange={(e) => updateMaterial(index, { name: e.target.value })}
                placeholder="Наименование"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={material.unit}
                onChange={(e) => updateMaterial(index, { unit: e.target.value })}
                placeholder="Ед.изм."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="number"
                value={material.quantity}
                onChange={(e) => updateMaterial(index, { quantity: Number(e.target.value) })}
                placeholder="Кол-во"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="number"
                value={material.unitPrice}
                onChange={(e) => updateMaterial(index, { unitPrice: Number(e.target.value) })}
                placeholder="Цена"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  const newMaterials = [...materials];
                  newMaterials.splice(index, 1);
                  setMaterials(newMaterials);
                }}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Работы</h3>
          <button
            type="button"
            onClick={addWork}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить работу
          </button>
        </div>

        {works.map((work, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 mb-4">
            <div className="col-span-2">
              <input
                type="text"
                value={work.name}
                onChange={(e) => updateWork(index, { name: e.target.value })}
                placeholder="Наименование"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={work.unit}
                onChange={(e) => updateWork(index, { unit: e.target.value })}
                placeholder="Ед.изм."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="number"
                value={work.quantity}
                onChange={(e) => updateWork(index, { quantity: Number(e.target.value) })}
                placeholder="Кол-во"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="number"
                value={work.unitPrice}
                onChange={(e) => updateWork(index, { unitPrice: Number(e.target.value) })}
                placeholder="Цена"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  const newWorks = [...works];
                  newWorks.splice(index, 1);
                  setWorks(newWorks);
                }}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
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
          Сохранить
        </button>
      </div>
    </form>
  );
}