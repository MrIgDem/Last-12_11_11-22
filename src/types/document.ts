export type DocumentType = 
  | 'passport'           // Паспорт трассы
  | 'scheme'            // Схемы
  | 'plan'              // Планы
  | 'protocol'          // Протоколы
  | 'act'               // Акты
  | 'certificate'       // Сертификаты
  | 'report'            // Отчеты
  | 'verification'      // Поверки
  | 'other';            // Прочее

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'archived';

export interface ProjectDocument {
  id: string;
  type: 'RD' | 'ID';  // РД or ИД
  code: string;       // Document code
  name: string;
  status: DocumentStatus;
  customer: string;
  files: DocumentFile[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DocumentStore {
  documents: ProjectDocument[];
  isLoading: boolean;
  error: string | null;
  
  addDocument: (doc: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'files'>) => void;
  updateDocument: (id: string, updates: Partial<ProjectDocument>) => void;
  removeDocument: (id: string) => void;
  
  addFileToDocument: (docId: string, file: Omit<DocumentFile, 'id' | 'uploadedAt' | 'url'>) => Promise<void>;
  removeFileFromDocument: (docId: string, fileId: string) => void;
  
  getDocumentsByType: (type: 'RD' | 'ID') => ProjectDocument[];
  getDocumentsByStatus: (status: DocumentStatus) => ProjectDocument[];
}