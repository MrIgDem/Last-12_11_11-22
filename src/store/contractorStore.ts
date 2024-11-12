import { create } from 'zustand';
import { ContractorStore, Contractor, Contract } from '../types/contractor';

export const useContractorStore = create<ContractorStore>((set, get) => ({
  contractors: [],
  contracts: [],
  isLoading: false,
  error: null,

  // Операции с подрядчиками
  addContractor: (contractorData) => {
    set((state) => ({
      contractors: [
        ...state.contractors,
        {
          ...contractorData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateContractor: (id, data) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === id
          ? {
              ...contractor,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  removeContractor: (id) => {
    set((state) => ({
      contractors: state.contractors.filter((contractor) => contractor.id !== id),
    }));
  },

  blacklistContractor: (id, reason) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === id
          ? {
              ...contractor,
              status: 'blacklisted',
              blacklistReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  // Операции с контактами
  addContact: (contractorId, contactData) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === contractorId
          ? {
              ...contractor,
              contacts: [
                ...contractor.contacts,
                {
                  ...contactData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  updateContact: (contractorId, contactId, data) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === contractorId
          ? {
              ...contractor,
              contacts: contractor.contacts.map((contact) =>
                contact.id === contactId ? { ...contact, ...data } : contact
              ),
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  removeContact: (contractorId, contactId) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === contractorId
          ? {
              ...contractor,
              contacts: contractor.contacts.filter(
                (contact) => contact.id !== contactId
              ),
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  // Операции с лицензиями
  addLicense: (contractorId, licenseData) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === contractorId
          ? {
              ...contractor,
              licenses: [
                ...contractor.licenses,
                {
                  ...licenseData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  updateLicense: (contractorId, licenseId, data) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === contractorId
          ? {
              ...contractor,
              licenses: contractor.licenses.map((license) =>
                license.id === licenseId ? { ...license, ...data } : license
              ),
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  removeLicense: (contractorId, licenseId) => {
    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === contractorId
          ? {
              ...contractor,
              licenses: contractor.licenses.filter(
                (license) => license.id !== licenseId
              ),
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  // Операции с договорами
  createContract: (contractData) => {
    set((state) => ({
      contracts: [
        ...state.contracts,
        {
          ...contractData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateContract: (id, data) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === id
          ? {
              ...contract,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : contract
      ),
    }));
  },

  terminateContract: (id, reason) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === id
          ? {
              ...contract,
              status: 'terminated',
              notes: reason,
              updatedAt: new Date().toISOString(),
            }
          : contract
      ),
    }));
  },

  // Операции с этапами и платежами
  addMilestone: (contractId, milestoneData) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              milestones: [
                ...contract.milestones,
                {
                  ...milestoneData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : contract
      ),
    }));
  },

  completeMilestone: (contractId, milestoneId, completionDate) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              milestones: contract.milestones.map((milestone) =>
                milestone.id === milestoneId
                  ? {
                      ...milestone,
                      status: 'completed',
                      completionDate,
                    }
                  : milestone
              ),
              updatedAt: new Date().toISOString(),
            }
          : contract
      ),
    }));
  },

  addPayment: (contractId, paymentData) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              payments: [
                ...contract.payments,
                {
                  ...paymentData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : contract
      ),
    }));
  },

  updatePayment: (contractId, paymentId, data) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              payments: contract.payments.map((payment) =>
                payment.id === paymentId ? { ...payment, ...data } : payment
              ),
              updatedAt: new Date().toISOString(),
            }
          : contract
      ),
    }));
  },

  // Оценка эффективности
  updatePerformance: (contractId, performance) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              performance,
              updatedAt: new Date().toISOString(),
            }
          : contract
      ),
    }));
  },

  calculateContractorRating: (contractorId) => {
    const contracts = get().contracts.filter(
      (contract) => contract.contractorId === contractorId
    );

    if (contracts.length === 0) return;

    const averageRating =
      contracts.reduce((sum, contract) => {
        const performance = contract.performance;
        if (!performance) return sum;
        return (
          sum +
          (performance.qualityScore || 0) +
          (performance.timelinessScore || 0) +
          (performance.safetyScore || 0)
        );
      }, 0) / (contracts.length * 3);

    set((state) => ({
      contractors: state.contractors.map((contractor) =>
        contractor.id === contractorId
          ? {
              ...contractor,
              rating: Math.min(Math.max(Math.round(averageRating), 1), 5) as 1 | 2 | 3 | 4 | 5,
              updatedAt: new Date().toISOString(),
            }
          : contractor
      ),
    }));
  },

  // Отчеты
  generateContractorReport: async (contractorId) => {
    // В реальном приложении здесь должна быть генерация отчета
    return new Blob([''], { type: 'application/pdf' });
  },

  generateContractReport: async (contractId) => {
    // В реальном приложении здесь должна быть генерация отчета
    return new Blob([''], { type: 'application/pdf' });
  },

  generatePaymentReport: async (startDate, endDate) => {
    // В реальном приложении здесь должна быть генерация отчета
    return new Blob([''], { type: 'application/pdf' });
  },

  // Уведомления
  getExpiringLicenses: (days) => {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    const expiring: ReturnType<ContractorStore['getExpiringLicenses']> = [];

    get().contractors.forEach((contractor) => {
      contractor.licenses.forEach((license) => {
        const expiryDate = new Date(license.expiryDate);
        if (expiryDate >= now && expiryDate <= deadline) {
          expiring.push({
            contractor,
            license,
            daysLeft: Math.ceil(
              (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      });
    });

    return expiring.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  getExpiringInsurance: (days) => {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    const expiring: ReturnType<ContractorStore['getExpiringInsurance']> = [];

    get().contractors.forEach((contractor) => {
      contractor.insurance.forEach((insurance) => {
        const expiryDate = new Date(insurance.endDate);
        if (expiryDate >= now && expiryDate <= deadline) {
          expiring.push({
            contractor,
            insurance,
            daysLeft: Math.ceil(
              (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      });
    });

    return expiring.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  getUpcomingPayments: (days) => {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    const upcoming: ReturnType<ContractorStore['getUpcomingPayments']> = [];

    get().contracts.forEach((contract) => {
      contract.payments.forEach((payment) => {
        const paymentDate = new Date(payment.plannedDate);
        if (
          payment.status !== 'paid' &&
          paymentDate >= now &&
          paymentDate <= deadline
        ) {
          upcoming.push({
            contract,
            payment,
            daysLeft: Math.ceil(
              (paymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      });
    });

    return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  // Поиск и фильтрация
  searchContractors: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().contractors.filter(
      (contractor) =>
        contractor.name.toLowerCase().includes(lowercaseQuery) ||
        contractor.legalName?.toLowerCase().includes(lowercaseQuery) ||
        contractor.inn.includes(lowercaseQuery)
    );
  },

  getContractorsBySpecialization: (specialization) => {
    return get().contractors.filter((contractor) =>
      contractor.specializations.includes(specialization)
    );
  },

  getContractsByContractor: (contractorId) => {
    return get().contracts.filter(
      (contract) => contract.contractorId === contractorId
    );
  },

  getContractsByStatus: (status) => {
    return get().contracts.filter((contract) => contract.status === status);
  },

  getOverduePayments: () => {
    const now = new Date();
    const overdue: ReturnType<ContractorStore['getOverduePayments']> = [];

    get().contracts.forEach((contract) => {
      contract.payments.forEach((payment) => {
        if (payment.status !== 'paid') {
          const paymentDate = new Date(payment.plannedDate);
          if (paymentDate < now) {
            overdue.push({
              contract,
              payment,
              daysOverdue: Math.ceil(
                (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
              ),
            });
          }
        }
      });
    });

    return overdue.sort((a, b) => b.daysOverdue - a.daysOverdue);
  },
}));