import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { validateFile, formatFileSize } from '../../utils/fileValidation';
import { FileUploadProgress } from '../common/FileUploadProgress';
import { FileUploadDialog } from '../common/FileUploadDialog';

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
}

export function DocumentUpload({ onUpload, maxFiles = 5 }: DocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const invalidFiles = acceptedFiles.filter(file => !validateFile(file).isValid);
    
    if (invalidFiles.length > 0) {
      setError(`Некоторые файлы не могут быть загружены: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Симулируем загрузку
    acceptedFiles.forEach(file => {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        
        if (progress >= 100) {
          clearInterval(interval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }
      }, 200);
    });

    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, removeFile } = useDropzone({
    onDrop,
    maxFiles,
    validator: validateFile
  });

  const handleRemoveFile = (fileName: string) => {
    setFileToDelete(fileName);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      const file = acceptedFiles.find(f => f.name === fileToDelete);
      if (file) {
        removeFile(file);
      }
    }
    setShowDeleteDialog(false);
    setFileToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm font-medium text-indigo-600">
            Перетащите файлы сюда или нажмите для выбора
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Максимальный размер файла: 10MB
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" onClick={() => setError(null)} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <FileUploadProgress
          key={fileName}
          fileName={fileName}
          progress={progress}
        />
      ))}

      {acceptedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {acceptedFiles.map((file, index) => (
              <li key={index} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FileUploadDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Удалить файл"
        message="Вы уверены, что хотите удалить этот файл?"
      />
    </div>
  );
}