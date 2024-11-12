import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';

interface AttachmentButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

export function AttachmentButton({ 
  onFileSelect, 
  accept = '.pdf', 
  label = 'Прикрепить файл' 
}: AttachmentButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="inline-flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center text-gray-400 hover:text-gray-500"
        title={label}
      >
        <Paperclip className="h-5 w-5" />
      </button>
    </div>
  );
}