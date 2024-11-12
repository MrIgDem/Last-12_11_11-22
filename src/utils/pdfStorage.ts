// Утилита для работы с PDF файлами
export interface StoredPdf {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export const pdfStorage = {
  async savePdf(file: File): Promise<StoredPdf> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const pdfData = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: reader.result as string,
          createdAt: new Date().toISOString()
        };

        const pdfs = this.getPdfs();
        pdfs.push(pdfData);
        localStorage.setItem('storedPdfs', JSON.stringify(pdfs));
        
        resolve(pdfData);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read PDF file'));
      };

      reader.readAsDataURL(file);
    });
  },

  getPdfs(): StoredPdf[] {
    const pdfsJson = localStorage.getItem('storedPdfs');
    return pdfsJson ? JSON.parse(pdfsJson) : [];
  },

  getPdfById(id: string): StoredPdf | undefined {
    return this.getPdfs().find(pdf => pdf.id === id);
  },

  deletePdf(id: string): void {
    const pdfs = this.getPdfs().filter(pdf => pdf.id !== id);
    localStorage.setItem('storedPdfs', JSON.stringify(pdfs));
  }
};