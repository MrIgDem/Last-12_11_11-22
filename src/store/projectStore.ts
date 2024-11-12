import { create } from 'zustand';
import { Project, ProjectStore, ProjectStage } from '../types/project';
import { useAuthStore } from './authStore';
import { canViewProject, canEditProject } from '../utils/accessControl';
import { testProjects } from '../utils/testData';

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: testProjects,
  isLoading: false,

  addProject: (projectData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...projectData,
          id: Math.random().toString(36).substr(2, 9),
          stages: [],
          type: 'b2b',
          rdStatus: 'not_started',
          idStatus: 'not_started',
        },
      ],
    }));
  },

  updateProject: (id, data) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const project = get().projects.find(p => p.id === id);
    if (!project || !canEditProject(user, project)) return;

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...data } : project
      ),
    }));
  },

  deleteProject: (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const project = get().projects.find(p => p.id === id);
    if (!project || !canEditProject(user, project)) return;

    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    }));
  },

  addStage: (projectId, stageData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const project = get().projects.find(p => p.id === projectId);
    if (!project || !canEditProject(user, project)) return;

    const newStage: ProjectStage = {
      ...stageData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'not_started',
      completionPercentage: 0
    };

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, stages: [...project.stages, newStage] }
          : project
      ),
    }));
  },

  updateStage: (projectId, stageId, data) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const project = get().projects.find(p => p.id === projectId);
    if (!project || !canEditProject(user, project)) return;

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              stages: project.stages.map((stage) =>
                stage.id === stageId ? { ...stage, ...data } : stage
              ),
            }
          : project
      ),
    }));
  },

  deleteStage: (projectId, stageId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const project = get().projects.find(p => p.id === projectId);
    if (!project || !canEditProject(user, project)) return;

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              stages: project.stages.filter((stage) => stage.id !== stageId),
            }
          : project
      ),
    }));
  },

  getProjectsByType: (type) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];

    return get().projects.filter(project => 
      project.type === type && canViewProject(user, project)
    );
  },

  getProjectsByStatus: (status) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];

    return get().projects.filter(project => 
      project.rdStatus === status && canViewProject(user, project)
    );
  }
}));