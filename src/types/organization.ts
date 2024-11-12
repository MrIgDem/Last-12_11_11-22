export interface Certificate {
  id: string;
  name: string;
  number: string;
  validUntil: string;
  fileUrl?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  inn: string;
  ogrn: string;
  sroNumber: string;
  certificates: Certificate[];
}

export interface OrganizationStore {
  organization: Organization | null;
  isLoading: boolean;
  updateOrganization: (data: Partial<Organization>) => void;
  addCertificate: (certificate: Omit<Certificate, 'id' | 'createdAt'>) => void;
  removeCertificate: (id: string) => void;
}