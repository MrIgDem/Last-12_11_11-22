import React, { useState } from 'react';
import { useContractorStore } from '../../store/contractorStore';
import { Contractor, ContractorContact, ContractorLicense, ContractorInsurance } from '../../types/contractor';
import { X, Plus, Building2 } from 'lucide-react';
import { DocumentUpload } from '../documents/DocumentUpload';

interface ContractorFormProps {
  onClose: () => void;
  contractor?: Contractor;
}

export function ContractorForm({ onClose, contractor }: ContractorFormProps) {
  const { addContractor, updateContractor } = useContractorStore();
  const [formData, setFormData] = useState<Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>>(
    contractor || {
      type: 'company',
      name: '',
      legalName: '',
      inn: '',
      kpp: '',
      ogrn: '',
      registrationAddress: '',
      actualAddress: '',
      bankDetails: {
        bankName: '',
        bik: '',
        accountNumber: '',
        correspondentAccount: '',
      },
      contacts: [],
      licenses: [],
      insurance: [],
      specializations: [],
      rating: 3,
      status: 'active',
    }
  );

  const [newContact, setNewContact] = useState<Omit<ContractorContact, 'id'>>({
    name: '',
    position: '',
    email: '',
    phone: '',
    isMain: false,
  });

  const [newLicense, setNewLicense] = useState<Omit<ContractorLicense, 'id'>>({
    type: '',
    number: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    scope: [],
  });

  const [newInsurance, setNewInsurance] = useState<Omit<ContractorInsurance, 'id'>>({
    type: '',
    provider: '',
    policyNumber: '',
    coverage: 0,
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contractor) {
      updateContractor(contractor.id, formData);
    } else {
      addContractor(formData);
    }
    onClose();
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.email && newContact.phone) {
      setFormData(prev => ({
        ...prev,
        contacts: [...prev.contacts, { ...newContact, id: Math.random().toString(36).substr(2, 9) }],
      }));
      setNewContact({
        name: '',
        position: '',
        email: '',
        phone: '',
        isMain: false,
      });
    }
  };

  const handleAddLicense = () => {
    if (newLicense.type && newLicense.number) {
      setFormData(prev => ({
        ...prev,
        licenses: [...prev.licenses, { ...newLicense, id: Math.random().toString(36).substr(2, 9) }],
      }));
      setNewLicense({
        type: '',
        number: '',
        issueDate: '',
        expiryDate: '',
        issuingAuthority: '',
        scope: [],
      });
    }
  };

  const handleAddInsurance = () => {
    if (newInsurance.type && newInsurance.policyNumber) {
      setFormData(prev => ({
        ...prev,
        insurance: [...prev.insurance, { ...newInsurance, id: Math.random().toString(36).substr(2, 9) }],
      }));
      setNewInsurance({
        type: '',
        provider: '',
        policyNumber: '',
        coverage: 0,
        startDate: '',
        endDate: '',
      });
    }
  };

  const handleFileUpload = (files: File[]) => {
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
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
        
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {contractor ? 'Редактирование подрядчика' : 'Добавление подрядчика'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Тип
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'company' | 'individual' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="company">Юридическое лицо</option>
                  <option value="individual">Индивидуальный предприниматель</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Наименование
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              {formData.type === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Юридическое наименование
                  </label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ИНН
                </label>
                <input
                  type="text"
                  value={formData.inn}
                  onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              {formData.type === 'company' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      КПП
                    </label>
                    <input
                      type="text"
                      value={formData.kpp}
                      onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ОГРН
                    </label>
                    <input
                      type="text"
                      value={formData.ogrn}
                      onChange={(e) => setFormData({ ...formData, ogrn: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Юридический адрес
                </label>
                <input
                  type="text"
                  value={formData.registrationAddress}
                  onChange={(e) => setFormData({ ...formData, registrationAddress: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Фактический адрес
                </label>
                <input
                  type="text"
                  value={formData.actualAddress}
                  onChange={(e) => setFormData({ ...formData, actualAddress: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bank Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Банковские реквизиты
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Наименование банка
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.bankName}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    БИК
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.bik}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, bik: e.target.value },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Расчетный счет
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Корреспондентский счет
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.correspondentAccount}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, correspondentAccount: e.target.value },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Контакты
              </h3>
              <div className="space-y-4">
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.position}</p>
                      <div className="flex space-x-4">
                        <span className="text-sm">{contact.phone}</span>
                        <span className="text-sm">{contact.email}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        contacts: prev.contacts.filter((_, i) => i !== index),
                      }))}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="ФИО"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newContact.position}
                    onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                    placeholder="Должность"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="Email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Телефон"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newContact.isMain}
                    onChange={(e) => setNewContact({ ...newContact, isMain: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Основной контакт
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Добавить контакт
                </button>
              </div>
            </div>

            {/* Licenses */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Лицензии и разрешения
              </h3>
              <div className="space-y-4">
                {formData.licenses.map((license, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{license.type}</p>
                      <p className="text-sm text-gray-500">
                        №{license.number} от {license.issueDate} до {license.expiryDate}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        licenses: prev.licenses.filter((_, i) => i !== index),
                      }))}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={newLicense.type}
                    onChange={(e) => setNewLicense({ ...newLicense, type: e.target.value })}
                    placeholder="Тип лицензии"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newLicense.number}
                    onChange={(e) => setNewLicense({ ...newLicense, number: e.target.value })}
                    placeholder="Номер"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    value={newLicense.issueDate}
                    onChange={(e) => setNewLicense({ ...newLicense, issueDate: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    value={newLicense.expiryDate}
                    onChange={(e) => setNewLicense({ ...newLicense, expiryDate: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLicense}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Добавить лицензию
                </button>
              </div>
            </div>

            {/* Insurance */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Страхование
              </h3>
              <div className="space-y-4">
                {formData.insurance.map((insurance, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insurance.type}</p>
                      <p className="text-sm text-gray-500">
                        {insurance.provider} - Полис №{insurance.policyNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Покрытие: {insurance.coverage.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        insurance: prev.insurance.filter((_, i) => i !== index),
                      }))}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={newInsurance.type}
                    onChange={(e) => setNewInsurance({ ...newInsurance, type: e.target.value })}
                    placeholder="Тип страхования"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newInsurance.provider}
                    onChange={(e) => setNewInsurance({ ...newInsurance, provider: e.target.value })}
                    placeholder="Страховая компания"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newInsurance.policyNumber}
                    onChange={(e) => setNewInsurance({ ...newInsurance, policyNumber: e.target.value })}
                    placeholder="Номер полиса"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    value={newInsurance.coverage}
                    onChange={(e) => setNewInsurance({ ...newInsurance, coverage: Number(e.target.value) })}
                    placeholder="Сумма покрытия"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    value={newInsurance.startDate}
                    onChange={(e) => setNewInsurance({ ...newInsurance, startDate: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    value={newInsurance.endDate}
                    onChange={(e) => setNewInsurance({ ...newInsurance, endDate: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddInsurance}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Добавить страховку
                </button>
              </div>
            </div>

            {/* Attachments */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Документы
              </h3>
              <DocumentUpload onUpload={handleFileUpload} />
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
                {contractor ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}