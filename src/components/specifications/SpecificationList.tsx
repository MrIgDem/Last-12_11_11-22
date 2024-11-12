import React from 'react';
import { useSpecificationStore } from '../../store/specificationStore';
import { FileSpreadsheet, FileText, Download, Trash2 } from 'lucide-react';

export function SpecificationList() {
  const { specifications, exportToExcel, generatePdf, removeSpecification } = useSpecificationStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {specifications.map((spec) => (
        <div key={spec.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{spec.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => exportToExcel(spec.id)}
                className="text-green-600 hover:text-green-900"
                title="Экспорт в Excel"
              >
                <FileSpreadsheet className="h-5 w-5" />
              </button>
              <button
                onClick={() => generatePdf(spec.id)}
                className="text-blue-600 hover:text-blue-900"
                title="Экспорт в PDF"
              >
                <FileText className="h-5 w-5" />
              </button>
              <button
                onClick={() => removeSpecification(spec.id)}
                className="text-red-600 hover:text-red-900"
                title="Удалить"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Материалы</p>
              <p className="text-lg font-medium text-gray-900">
                {formatCurrency(spec.totalMaterialsCost)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Работы</p>
              <p className="text-lg font-medium text-gray-900">
                {formatCurrency(spec.totalWorksCost)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Итого</p>
              <p className="text-lg font-medium text-gray-900">
                {formatCurrency(spec.totalCost)}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Материалы</h4>
                <ul className="space-y-2">
                  {spec.materials.map((material) => (
                    <li key={material.id} className="text-sm text-gray-600">
                      {material.name} - {material.quantity} {material.unit} × {formatCurrency(material.unitPrice)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Работы</h4>
                <ul className="space-y-2">
                  {spec.works.map((work) => (
                    <li key={work.id} className="text-sm text-gray-600">
                      {work.name} - {work.quantity} {work.unit} × {formatCurrency(work.unitPrice)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}