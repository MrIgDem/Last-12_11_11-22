import { create } from 'zustand';
import { DocumentStore, ProjectDocument, DocumentFile, DocumentStatus } from '../types/document';
import { fileStorage } from '../utils/fileStorage';

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,

  addDocument: (docData) => {
    set((state) => ({
      documents: [
        ...state.documents,
        {
          ...docData,
          id: Math.random().toString(36).substr(2, 9),
          files: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateDocument: (id, updates) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : doc
      ),
    }));
  },

  removeDocument: (id) => {
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    }));
  },

  addFileToDocument: async (docId, fileData) => {
    try {
      set({ isLoading: true, error: null });
      
      const file = await fileStorage.saveFile(fileData as unknown as File);
      
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                files: [
                  ...doc.files,
                  {
                    ...fileData,
                    id: Math.random().toString(36).substr(2, 9),
                    url: file.data,
                    uploadedAt: new Date().toISOString(),
                  },
                ],
                updatedAt: new Date().toISOString(),
              }
            : doc
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to upload file' 
      });
    }
  },

  removeFileFromDocument: (docId, fileId) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              files: doc.files.filter((file) => file.id !== fileId),
              updatedAt: new Date().toISOString(),
            }
          : doc
      ),
    }));
  },

  getDocumentsByType: (type) => {
    return get().documents.filter((doc) => doc.type === type);
  },

  getDocumentsByStatus: (status) => {
    return get().documents.filter((doc) => doc.status === status);
  },
}));