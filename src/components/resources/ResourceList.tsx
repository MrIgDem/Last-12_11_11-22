import React, { useState } from 'react';
import { useResourceStore } from '../../store/resourceStore';
import { Resource, ResourceType } from '../../types/resource';
import { Search, Filter, Users, Wrench, Package, Truck } from 'lucide-react';

export function ResourceList() {
  const { resources, searchResources } = useResourceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');

  const filteredResources = selectedType === 'all' 
    ? searchResources(searchQuery)
    : resources.filter(resource => 
        resource.type === selectedType && 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'human':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'equipment':
        return <Wrench className="h-5 w-5 text-green-500" />;
      case 'material':
        return <Package className="h-5 w-5 text-yellow-500" />;
      case 'vehicle':
        return <Truck className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              placeholder="Поиск ресурсов..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ResourceType | 'all')}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Все типы</option>
              <option value="human">Персонал</option>
              <option value="equipment">Оборудование</option>
              <option value="material">Материалы</option>
              <option value="vehicle">Транспорт</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredResources.map((resource) => (
            <li key={resource.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getResourceIcon(resource.type)}
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {resource.code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(resource.status)
                  }`}>
                    {resource.status}
                  </span>
                </div>
              </div>

              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  {resource.location && (
                    <p className="flex items-center text-sm text-gray-500">
                      Локация: {resource.location}
                    </p>
                  )}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Стоимость: {resource.cost.hourly ? `${resource.cost.hourly} ₽/час` : 
                               resource.cost.daily ? `${resource.cost.daily} ₽/день` :
                               resource.cost.monthly ? `${resource.cost.monthly} ₽/мес` : 'Не указана'}
                  </p>
                </div>
              </div>

              {resource.skills && resource.skills.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {resource.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resource.certifications && resource.certifications.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Сертификаты:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {resource.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {cert.name} (до {new Date(cert.validUntil).toLocaleDateString('ru-RU')})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}