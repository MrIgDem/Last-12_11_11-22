import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useDocumentStore } from '../store/documentStore';
import { FileUpload } from '../components/common/FileUpload';
import { fileStorage } from '../utils/fileStorage';
import { DocumentType } from '../types/document';
import { FileText, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

export function DocumentsPage() {
  const { user, logout } = useAuthStore();
  const { documents, addDocument, addFileToDocument } = useDocumentStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<DocumentType>>({
    name: '',
    code: '',
    type: 'РД',
    customer: '',
    files: [],
  });
  const [selectedRdCode, setSelectedRdCode] = useState('');

  if (!user) return null;

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocument.name && newDocument.code && newDocument.type && newDocument.customer) {
      addDocument(newDocument as Omit<DocumentType, 'id' | 'createdAt'>);
      setNewDocument({
        name: '',
        code: '',
        type: 'РД',
        customer: '',
        files: [],
      });
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (docId: string, file: File) => {
    try {
      const storedFile = await fileStorage.saveFile(file);
      addFileToDocument(docId, {
        name: file.name,
        type: 'document',
        fileId: storedFile.id,
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const rdDocuments = documents.filter(doc => doc.type === 'РД');

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Документы</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Создать документ
          </button>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Список документов
            </h3>
            <div className="mt-6 divide-y divide-gray-200">
              {documents.map((doc) => (
                <div key={doc.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {doc.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Шифр: {doc.code} | Тип: {doc.type} | Заказчик: {doc.customer}
                      </p>
                    </div>
                    <FileUpload
                      onFileSelect={(file) => handleFileUpload(doc.id, file)}
                      label="Добавить файл"
                    />
                  </div>
                  {doc.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {doc.files.map((file) => {
                        const storedFile = fileStorage.getFileById(file.fileId);
                        return storedFile ? (
                          <div
                            key={file.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {file.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => fileStorage.downloadFile(storedFile)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Скачать
                              </button>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {isCreating && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsCreating(false)} />
              
              <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Создать документ
                </h3>

                <form onSubmit={handleCreateDocument} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Название
                    </label>
                    <input
                      type="text"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({
                        ...newDocument,
                        name: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Шифр проекта
                    </label>
                    <input
                      type="text"
                      value={newDocument.code}
                      onChange={(e) => setNewDocument({
                        ...newDocument,
                        code: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Тип документации
                    </label>
                    <select
                      value={newDocument.type}
                      onChange={(e) => {
                        setNewDocument({
                          ...newDocument,
                          type: e.target.value as 'РД' | 'ИД',
                        });
                        if (e.target.value === 'ИД') {
                          setSelectedRdCode('');
                        }
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="РД">РД</option>
                      <option value="ИД">ИД</option>
                    </select>
                  </div>

                  {newDocument.type === 'ИД' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Связать с РД
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <select
                          value={selectedRdCode}
                          onChange={(e) => setSelectedRdCode(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">Выберите РД</option>
                          {rdDocuments.map((rd) => (
                            <option key={rd.id} value={rd.code}>
                              {rd.code} - {rd.name}
                            </option>
                          ))}
                        </select>
                        {selectedRdCode && (
                          <LinkIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Заказчик
                    </label>
                    <input
                      type="text"
                      value={newDocument.customer}
                      onChange={(e) => setNewDocument({
                        ...newDocument,
                        customer: e.target.value,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Создать
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