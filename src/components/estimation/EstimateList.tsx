import React, { useState } from 'react';
import { useEstimateStore } from '../../store/estimateStore';
import { FileSpreadsheet, FileText, Search, Filter } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export function EstimateList() {
  const { estimates, generateKS2, generateKS3, generateM29 } = useEstimateStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEstimates = estimates.filter(estimate => 
    (statusFilter === 'all' || estimate.status === statusFilter) &&
    (estimate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     estimate.number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleGenerateDocument = async (estimateId: string, type: 'KS2' | 'KS3' | 'M29') => {
    try {
      let url;
      switch (type) {
        case 'KS2':
          url = await generateKS2(estimateId);
          break;
        case 'KS3':
          url = await generateKS3(estimateId);
          break;
        case 'M29':
          url = await generateM29(estimateId);
          break;
      }
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
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
              placeholder="Поиск смет..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Все статусы</option>
              <option value="draft">Черновик</option>
              <option value="approved">Утверждено</option>
              <option value="rejected">Отклонено</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredEstimates.map((estimate) => (
            <li key={estimate.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {estimate.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Номер: {estimate.number}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleGenerateDocument(estimate.id, 'KS2')}
                    className="text-gray-400 hover:text-gray-500"
                    title="КС-2"
                  >
                    <FileSpreadsheet className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleGenerateDocument(estimate.id, 'KS3')}
                    className="text-gray-400 hover:text-gray-500"
                    title="КС-3"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleGenerateDocument(estimate.id, 'M29')}
                    className="text-gray-400 hover:text-gray-500"
                    title="М-29"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Материалы</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatCurrency(estimate.totalMaterialsCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Работы</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatCurrency(estimate.totalWorksCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Оборудование</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatCurrency(estimate.totalEquipmentCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Итого</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatCurrency(estimate.totalCost)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex space-x-4 text-gray-500">
                  <span>Создано: {formatDate(estimate.createdAt)}</span>
                  {estimate.approvedBy && (
                    <span>
                      Утверждено: {estimate.approvedBy} ({formatDate(estimate.approvedAt!)})
                    </span>
                  )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  estimate.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : estimate.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {estimate.status === 'approved' ? 'Утверждено' :
                   estimate.status === 'rejected' ? 'Отклонено' : 'Черновик'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}