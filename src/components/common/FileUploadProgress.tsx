import React from 'react';
import { Loader } from 'lucide-react';

interface FileUploadProgressProps {
  progress: number;
  fileName: string;
}

export function FileUploadProgress({ progress, fileName }: FileUploadProgressProps) {
  return (
    <div className="flex items-center space-x-4">
      <Loader className="h-5 w-5 animate-spin text-indigo-500" />
      <div className="flex-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-900">{fileName}</span>
          <span className="text-gray-500">{progress}%</span>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}