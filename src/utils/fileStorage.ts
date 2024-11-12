// Simple file storage utility using localStorage for demo purposes
// In a real application, you would use a proper backend storage solution

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64 encoded file data
  createdAt: string;
}

export const fileStorage = {
  async saveFile(file: File): Promise<StoredFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const fileData = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string,
          createdAt: new Date().toISOString()
        };

        const files = this.getFiles();
        files.push(fileData);
        localStorage.setItem('storedFiles', JSON.stringify(files));
        
        resolve(fileData);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  },

  getFiles(): StoredFile[] {
    const filesJson = localStorage.getItem('storedFiles');
    return filesJson ? JSON.parse(filesJson) : [];
  },

  getFileById(id: string): StoredFile | undefined {
    return this.getFiles().find(file => file.id === id);
  },

  deleteFile(id: string): void {
    const files = this.getFiles().filter(file => file.id !== id);
    localStorage.setItem('storedFiles', JSON.stringify(files));
  },

  downloadFile(file: StoredFile): void {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};