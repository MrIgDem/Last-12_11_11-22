import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useDocumentStore } from '../store/documentStore';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { FileText, ArrowLeft, Download, Trash2 } from 'lucide-react';

export function DocumentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { documents, addFileToDocument, removeFileFromDocument } = useDocumentStore();
  const document = documents.find(doc => doc.id === id);

  if (!user || !document) return null;

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      await addFileToDocument(document.id, {
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  };

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/documents')}
              className="text-gray-400 hover:text-gray-500"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">{document.name}</h1>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Тип документации</dt>
                <dd className="mt-1 text-sm text-gray-900">{document.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Шифр проекта</dt>
                <dd className="mt-1 text-sm text-gray-900">{document.code}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Статус</dt>
                <dd className="mt-1 text-sm text-gray-900">{document.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Дата создания</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(document.createdAt).toLocaleDateString('ru-RU')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Файлы документа</h3>
              <DocumentUpload onUpload={handleFileUpload} />
            </div>

            <ul className="divide-y divide-gray-200">
              {document.files.map((file) => (
                <li key={file.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          Загружен: {new Date(file.uploadedAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeFileFromDocument(document.id, file.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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