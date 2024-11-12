import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { StockItem, StockItemType, StockItemStatus } from '../types/inventory';
import { Package, Search, Filter, AlertTriangle, Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { InventoryTransactionForm } from '../components/inventory/InventoryTransactionForm';
import { InventoryItemForm } from '../components/inventory/InventoryItemForm';

export function InventoryPage() {
  const { user, logout } = useAuthStore();
  const { items, getLowStockItems, searchItems } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<StockItemType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<StockItemStatus | 'all'>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  if (!user) return null;

  const lowStockItems = getLowStockItems();
  
  const filteredItems = searchItems(searchQuery).filter(item => 
    (selectedType === 'all' || item.type === selectedType) &&
    (selectedStatus === 'all' || item.status === selectedStatus)
  );

  const getStatusColor = (status: StockItemStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'written_off': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Склад</h1>
          <button
            onClick={() => setIsAddingItem(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добавить товар
          </button>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Низкий уровень запасов
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {lowStockItems.map(item => (
                      <li key={item.id}>
                        {item.name} - осталось {item.quantity} {item.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

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
                placeholder="Поиск товаров..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as StockItemType | 'all')}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">Все типы</option>
                <option value="cable">Кабель</option>
                <option value="equipment">Оборудование</option>
                <option value="tool">Инструмент</option>
                <option value="consumable">Расходники</option>
              </select>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as StockItemStatus | 'all')}
              className="pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Все статусы</option>
              <option value="available">Доступно</option>
              <option value="reserved">Зарезервировано</option>
              <option value="in_use">В использовании</option>
              <option value="maintenance">На обслуживании</option>
              <option value="written_off">Списано</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.type}</div>
                    <div className="text-sm text-gray-500">{item.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </div>
                    {item.minQuantity && item.quantity <= item.minQuantity && (
                      <div className="text-sm text-red-600">
                        Мин. количество: {item.minQuantity}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(item.status)
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowTransactionForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <ArrowDown className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowTransactionForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <ArrowUp className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAddingItem && (
          <InventoryItemForm
            onClose={() => setIsAddingItem(false)}
          />
        )}

        {showTransactionForm && selectedItem && (
          <InventoryTransactionForm
            item={selectedItem}
            onClose={() => {
              setShowTransactionForm(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}