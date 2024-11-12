import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import { useOrganizationStore } from '../../store/organizationStore';
import { Certificate } from '../../types/organization';
import { FileText, Plus, Trash2 } from 'lucide-react';

export function OrganizationPage() {
  const { user, logout } = useAuthStore();
  const { organization, updateOrganization, addCertificate, removeCertificate } = useOrganizationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, 'id' | 'createdAt'>>({
    name: '',
    number: '',
    validUntil: '',
  });

  if (!user || !organization) return null;

  const handleOrganizationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    addCertificate(newCertificate);
    setNewCertificate({ name: '', number: '', validUntil: '' });
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Данные организации</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditing ? 'Отменить' : 'Редактировать'}
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleOrganizationUpdate}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Название организации
                  </label>
                  <input
                    type="text"
                    value={organization.name}
                    onChange={(e) => updateOrganization({ name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ИНН
                  </label>
                  <input
                    type="text"
                    value={organization.inn}
                    onChange={(e) => updateOrganization({ inn: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ОГРН
                  </label>
                  <input
                    type="text"
                    value={organization.ogrn}
                    onChange={(e) => updateOrganization({ ogrn: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Номер СРО
                  </label>
                  <input
                    type="text"
                    value={organization.sroNumber}
                    onChange={(e) => updateOrganization({ sroNumber: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Сохранить
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Сертификаты и лицензии</h2>
            
            <form onSubmit={handleAddCertificate} className="mb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Название"
                  value={newCertificate.name}
                  onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Номер"
                  value={newCertificate.number}
                  onChange={(e) => setNewCertificate({ ...newCertificate, number: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={newCertificate.validUntil}
                    onChange={(e) => setNewCertificate({ ...newCertificate, validUntil: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </form>

            <ul className="divide-y divide-gray-200">
              {organization.certificates.map((cert) => (
                <li key={cert.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                      <p className="text-sm text-gray-500">
                        Номер: {cert.number} | Действует до: {new Date(cert.validUntil).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Просмотр
                      </a>
                    )}
                    <button
                      onClick={() => removeCertificate(cert.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}