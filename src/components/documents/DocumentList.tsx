import React, { useState } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { FileText, Plus, Trash2, Download } from 'lucide-react';

export function DocumentList() {
  const { documents, deleteDocument } = useDocumentStore();
  const [filter, setFilter] = useState('');

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(filter.toLowerCase()) ||
    doc.code.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Поиск документов..."
          className="px-4 py-2 border rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Добавить документ
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{doc.name}</h3>
                <p className="text-sm text-gray-500">Код: {doc.code}</p>
                <p className="text-sm text-gray-500">Тип: {doc.type}</p>
              </div>
              <button 
                onClick={() => deleteDocument(doc.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-4 space-y-2">
              {doc.files.map(file => (
                <div key={file.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    {file.name}
                  </div>
                  <button className="text-blue-500 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}