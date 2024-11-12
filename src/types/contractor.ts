export type ContractorType = 'company' | 'individual';
export type ContractStatus = 'draft' | 'active' | 'suspended' | 'terminated' | 'completed';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';
export type ContractorRating = 1 | 2 | 3 | 4 | 5;

export interface ContractorLicense {
  id: string;
  type: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  scope: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface ContractorInsurance {
  id: string;
  type: string;
  provider: string;
  policyNumber: string;
  coverage: number;
  startDate: string;
  endDate: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface ContractorContact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isMain: boolean;
}

export interface Contractor {
  id: string;
  type: ContractorType;
  name: string;
  legalName?: string;
  inn: string;
  kpp?: string;
  ogrn?: string;
  registrationAddress: string;
  actualAddress?: string;
  bankDetails: {
    bankName: string;
    bik: string;
    accountNumber: string;
    correspondentAccount: string;
  };
  contacts: ContractorContact[];
  licenses: ContractorLicense[];
  insurance: ContractorInsurance[];
  specializations: string[];
  rating: ContractorRating;
  status: 'active' | 'inactive' | 'blacklisted';
  blacklistReason?: string;
  notes?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  contractorId: string;
  projectId: string;
  number: string;
  type: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  scope: string;
  terms: {
    paymentTerms: string;
    warrantyPeriod?: string;
    penalties?: string;
  };
  milestones: {
    id: string;
    name: string;
    dueDate: string;
    amount: number;
    status: 'pending' | 'completed' | 'overdue';
    completionDate?: string;
  }[];
  payments: {
    id: string;
    milestoneId?: string;
    type: 'advance' | 'milestone' | 'final';
    amount: number;
    plannedDate: string;
    actualDate?: string;
    status: PaymentStatus;
    invoiceNumber?: string;
    attachments?: {
      id: string;
      name: string;
      type: string;
      url: string;
    }[];
  }[];
  performance: {
    qualityScore?: number;
    timelinessScore?: number;
    safetyScore?: number;
    comments?: string;
  };
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractorStore {
  contractors: Contractor[];
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;

  // Операции с подрядчиками
  addContractor: (contractor: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContractor: (id: string, data: Partial<Contractor>) => void;
  removeContractor: (id: string) => void;
  blacklistContractor: (id: string, reason: string) => void;

  // Операции с контактами
  addContact: (contractorId: string, contact: Omit<ContractorContact, 'id'>) => void;
  updateContact: (contractorId: string, contactId: string, data: Partial<ContractorContact>) => void;
  removeContact: (contractorId: string, contactId: string) => void;

  // Операции с лицензиями
  addLicense: (contractorId: string, license: Omit<ContractorLicense, 'id'>) => void;
  updateLicense: (contractorId: string, licenseId: string, data: Partial<ContractorLicense>) => void;
  removeLicense: (contractorId: string, licenseId: string) => void;

  // Операции с договорами
  createContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContract: (id: string, data: Partial<Contract>) => void;
  terminateContract: (id: string, reason: string) => void;
  
  // Операции с этапами и платежами
  addMilestone: (contractId: string, milestone: Omit<Contract['milestones'][0], 'id'>) => void;
  completeMilestone: (contractId: string, milestoneId: string, completionDate: string) => void;
  addPayment: (contractId: string, payment: Omit<Contract['payments'][0], 'id'>) => void;
  updatePayment: (contractId: string, paymentId: string, data: Partial<Contract['payments'][0]>) => void;

  // Оценка эффективности
  updatePerformance: (contractId: string, performance: Contract['performance']) => void;
  calculateContractorRating: (contractorId: string) => void;

  // Отчеты
  generateContractorReport: (contractorId: string) => Promise<Blob>;
  generateContractReport: (contractId: string) => Promise<Blob>;
  generatePaymentReport: (startDate: string, endDate: string) => Promise<Blob>;

  // Уведомления
  getExpiringLicenses: (days: number) => Array<{
    contractor: Contractor;
    license: ContractorLicense;
    daysLeft: number;
  }>;
  getExpiringInsurance: (days: number) => Array<{
    contractor: Contractor;
    insurance: ContractorInsurance;
    daysLeft: number;
  }>;
  getUpcomingPayments: (days: number) => Array<{
    contract: Contract;
    payment: Contract['payments'][0];
    daysLeft: number;
  }>;

  // Поиск и фильтрация
  searchContractors: (query: string) => Contractor[];
  getContractorsBySpecialization: (specialization: string) => Contractor[];
  getContractsByContractor: (contractorId: string) => Contract[];
  getContractsByStatus: (status: ContractStatus) => Contract[];
  getOverduePayments: () => Array<{
    contract: Contract;
    payment: Contract['payments'][0];
    daysOverdue: number;
  }>;
}