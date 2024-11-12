import React, { useRef, useState } from 'react';
import { Upload, FileText, Edit2, Trash2 } from 'lucide-react';

interface PdfUploadProps {
  onFileSelect: (file: File) => void;
  currentFile?: {
    name: string;
    url: string;
  };
  onDelete?: () => void;
  label?: string;
}

export function PdfUpload({ onFileSelect, currentFile, onDelete, label = 'Загрузить PDF' }: PdfUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf"
        className="hidden"
      />
      
      {(currentFile || previewUrl) ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">
              {currentFile?.name || 'Документ PDF'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={currentFile?.url || previewUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-900"
            >
              <Edit2 className="h-4 w-4" />
            </a>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          {label}
        </button>
      )}
    </div>
  );
}