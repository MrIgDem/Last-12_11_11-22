import { create } from 'zustand';
import { Organization, OrganizationStore } from '../types/organization';

const defaultOrganization: Organization = {
  id: '1',
  name: 'Моя организация',
  inn: '',
  ogrn: '',
  sroNumber: '',
  certificates: [],
};

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  organization: defaultOrganization,
  isLoading: false,

  updateOrganization: (data) => {
    set((state) => ({
      organization: state.organization
        ? { ...state.organization, ...data }
        : null,
    }));
  },

  addCertificate: (certificateData) => {
    set((state) => ({
      organization: state.organization
        ? {
            ...state.organization,
            certificates: [
              ...state.organization.certificates,
              {
                ...certificateData,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : null,
    }));
  },

  removeCertificate: (id) => {
    set((state) => ({
      organization: state.organization
        ? {
            ...state.organization,
            certificates: state.organization.certificates.filter(
              (cert) => cert.id !== id
            ),
          }
        : null,
    }));
  },
}));