import React, { useState } from 'react';
import { useContractorStore } from '../../store/contractorStore';
import { Contractor } from '../../types/contractor';
import { Search, Filter, Star, Building2, Phone, Mail, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export function ContractorList() {
  const { contractors, searchContractors } = useContractorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'blacklisted'>('all');
  const [expandedContractor, setExpandedContractor] = useState<string | null>(null);

  const filteredContractors = searchContractors(searchQuery).filter(
    contractor => statusFilter === 'all' || contractor.status === statusFilter
  );

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: Contractor['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blacklisted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
              placeholder="Поиск подрядчиков..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
              <option value="blacklisted">В черном списке</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredContractors.map((contractor) => (
            <li key={contractor.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {contractor.name}
                      </h3>
                      {contractor.legalName && (
                        <p className="text-sm text-gray-500">
                          {contractor.legalName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {getRatingStars(contractor.rating)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(contractor.status)
                    }`}>
                      {contractor.status === 'active' ? 'Активный' :
                       contractor.status === 'inactive' ? 'Неактивный' : 'В черном списке'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex sm:space-x-4">
                    {contractor.contacts.filter(c => c.isMain).map(contact => (
                      <div key={contact.id} className="flex items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center ml-4">
                          <Mail className="h-4 w-4 mr-1" />
                          {contact.email}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      ИНН: {contractor.inn}
                    </p>
                  </div>
                </div>

                {contractor.status === 'blacklisted' && contractor.blacklistReason && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Причина блокировки: {contractor.blacklistReason}
                  </div>
                )}

                <div className="mt-2">
                  <button
                    onClick={() => setExpandedContractor(
                      expandedContractor === contractor.id ? null : contractor.id
                    )}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    {expandedContractor === contractor.id ? 'Скрыть детали' : 'Показать детали'}
                  </button>
                </div>

                {expandedContractor === contractor.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Специализации
                        </dt>
                        <dd className="mt-1">
                          <ul className="flex flex-wrap gap-2">
                            {contractor.specializations.map((spec, index) => (
                              <li
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Контакты
                        </dt>
                        <dd className="mt-1">
                          <ul className="space-y-2">
                            {contractor.contacts.map(contact => (
                              <li key={contact.id} className="text-sm">
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-gray-500">{contact.position}</p>
                                <div className="flex items-center space-x-4">
                                  <span>{contact.phone}</span>
                                  <span>{contact.email}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Лицензии
                        </dt>
                        <dd className="mt-1">
                          <ul className="space-y-2">
                            {contractor.licenses.map(license => (
                              <li key={license.id} className="text-sm">
                                <p className="font-medium">{license.type}</p>
                                <p className="text-gray-500">
                                  №{license.number} от {formatDate(license.issueDate)}
                                </p>
                                <p className="text-gray-500">
                                  Действует до: {formatDate(license.expiryDate)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Страхование
                        </dt>
                        <dd className="mt-1">
                          <ul className="space-y-2">
                            {contractor.insurance.map(insurance => (
                              <li key={insurance.id} className="text-sm">
                                <p className="font-medium">{insurance.type}</p>
                                <p className="text-gray-500">
                                  {insurance.provider} - Полис №{insurance.policyNumber}
                                </p>
                                <p className="text-gray-500">
                                  Покрытие: {insurance.coverage.toLocaleString('ru-RU')} ₽
                                </p>
                                <p className="text-gray-500">
                                  Действует до: {formatDate(insurance.endDate)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}