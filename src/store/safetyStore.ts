import { create } from 'zustand';
import { SafetyStore, SafetyIncident, SafetyInspection, SafetyTraining } from '../types/safety';
import { generateSafetyCertificate } from '../utils/certificateGenerator';

export const useSafetyStore = create<SafetyStore>((set, get) => ({
  incidents: [],
  inspections: [],
  trainings: [],
  isLoading: false,
  error: null,

  // Операции с инцидентами
  reportIncident: (incidentData) => {
    set((state) => ({
      incidents: [
        ...state.incidents,
        {
          ...incidentData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateIncident: (id, data) => {
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : incident
      ),
    }));
  },

  closeIncident: (id, resolution) => {
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              status: 'closed',
              preventiveMeasures: resolution,
              updatedAt: new Date().toISOString(),
            }
          : incident
      ),
    }));
  },

  addCorrectiveAction: (incidentId, actionData) => {
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              correctiveActions: [
                ...incident.correctiveActions,
                {
                  ...actionData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : incident
      ),
    }));
  },

  updateCorrectiveAction: (incidentId, actionId, data) => {
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              correctiveActions: incident.correctiveActions.map((action) =>
                action.id === actionId ? { ...action, ...data } : action
              ),
              updatedAt: new Date().toISOString(),
            }
          : incident
      ),
    }));
  },

  // Операции с инспекциями
  createInspection: (inspectionData) => {
    set((state) => ({
      inspections: [
        ...state.inspections,
        {
          ...inspectionData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateInspection: (id, data) => {
    set((state) => ({
      inspections: state.inspections.map((inspection) =>
        inspection.id === id
          ? {
              ...inspection,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : inspection
      ),
    }));
  },

  addViolation: (inspectionId, violationData) => {
    set((state) => ({
      inspections: state.inspections.map((inspection) =>
        inspection.id === inspectionId
          ? {
              ...inspection,
              violations: [
                ...inspection.violations,
                {
                  ...violationData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : inspection
      ),
    }));
  },

  resolveViolation: (inspectionId, violationId, resolution) => {
    set((state) => ({
      inspections: state.inspections.map((inspection) =>
        inspection.id === inspectionId
          ? {
              ...inspection,
              violations: inspection.violations.map((violation) =>
                violation.id === violationId
                  ? {
                      ...violation,
                      status: 'resolved',
                      resolvedAt: new Date().toISOString(),
                    }
                  : violation
              ),
              updatedAt: new Date().toISOString(),
            }
          : inspection
      ),
    }));
  },

  // Операции с тренингами
  scheduleTraining: (trainingData) => {
    set((state) => ({
      trainings: [
        ...state.trainings,
        {
          ...trainingData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateTraining: (id, data) => {
    set((state) => ({
      trainings: state.trainings.map((training) =>
        training.id === id
          ? {
              ...training,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : training
      ),
    }));
  },

  recordAttendance: (trainingId, employeeId, attended) => {
    set((state) => ({
      trainings: state.trainings.map((training) =>
        training.id === trainingId
          ? {
              ...training,
              participants: training.participants.map((participant) =>
                participant.employeeId === employeeId
                  ? { ...participant, attendance: attended }
                  : participant
              ),
              updatedAt: new Date().toISOString(),
            }
          : training
      ),
    }));
  },

  recordTestResults: (trainingId, employeeId, score) => {
    set((state) => ({
      trainings: state.trainings.map((training) =>
        training.id === trainingId
          ? {
              ...training,
              participants: training.participants.map((participant) =>
                participant.employeeId === employeeId
                  ? { ...participant, testScore: score }
                  : participant
              ),
              updatedAt: new Date().toISOString(),
            }
          : training
      ),
    }));
  },

  generateCertificate: async (trainingId, employeeId) => {
    const training = get().trainings.find((t) => t.id === trainingId);
    const participant = training?.participants.find(
      (p) => p.employeeId === employeeId
    );

    if (!training || !participant) {
      throw new Error('Training or participant not found');
    }

    const certificateId = await generateSafetyCertificate(training, participant);
    
    set((state) => ({
      trainings: state.trainings.map((t) =>
        t.id === trainingId
          ? {
              ...t,
              participants: t.participants.map((p) =>
                p.employeeId === employeeId
                  ? { ...p, certificateId }
                  : p
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }));

    return certificateId;
  },

  // Отчеты и аналитика
  generateSafetyReport: async (projectId, startDate, endDate) => {
    // Здесь должна быть реализация генерации отчета
    // Возвращаем заглушку
    return new Blob([''], { type: 'application/pdf' });
  },

  calculateSafetyMetrics: (projectId) => {
    const projectIncidents = get().getIncidentsByProject(projectId);
    const projectInspections = get().getInspectionsByProject(projectId);
    const now = new Date();
    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

    // Расчет показателей
    const incidentRate = projectIncidents.length / 30; // инцидентов в день
    const severityRate = projectIncidents.reduce(
      (acc, incident) => acc + (incident.severity === 'critical' ? 2 : 1),
      0
    ) / projectIncidents.length;

    const inspectionComplianceRate =
      projectInspections.filter((i) => 
        i.checklist.every((item) => item.status === 'pass')
      ).length / projectInspections.length;

    const trainings = get().trainings.filter(
      (t) => t.date >= monthAgo.toISOString()
    );
    const trainingCompletionRate =
      trainings.reduce(
        (acc, training) =>
          acc +
          training.participants.filter((p) => p.attendance && p.testScore >= 70)
            .length,
        0
      ) / (trainings.length * trainings.reduce((acc, t) => acc + t.participants.length, 0));

    const openViolations = projectInspections.reduce(
      (acc, inspection) =>
        acc +
        inspection.violations.filter((v) => v.status !== 'resolved').length,
      0
    );

    // Расчет тренда
    const trend = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      trend.push({
        date: dateStr,
        incidents: projectIncidents.filter(
          (incident) => incident.date.startsWith(dateStr)
        ).length,
        violations: projectInspections.reduce(
          (acc, inspection) =>
            acc +
            inspection.violations.filter(
              (v) =>
                v.status === 'open' &&
                new Date(v.deadline) <= date
            ).length,
          0
        ),
      });
    }

    return {
      incidentRate,
      severityRate,
      inspectionComplianceRate,
      trainingCompletionRate,
      openViolations,
      trend: trend.reverse(),
    };
  },

  // Уведомления
  getActiveIncidents: () => {
    return get().incidents.filter(
      (incident) => incident.status !== 'closed'
    );
  },

  getUpcomingTrainings: (days) => {
    const now = new Date();
    const future = new Date(now.setDate(now.getDate() + days));
    return get().trainings.filter(
      (training) =>
        new Date(training.date) >= now && new Date(training.date) <= future
    );
  },

  getOverdueCorrectiveActions: () => {
    const now = new Date();
    const overdue: ReturnType<SafetyStore['getOverdueCorrectiveActions']> = [];

    get().incidents.forEach((incident) => {
      incident.correctiveActions.forEach((action) => {
        if (
          action.status !== 'completed' &&
          new Date(action.deadline) < now
        ) {
          overdue.push({
            incident,
            action,
            daysOverdue: Math.ceil(
              (now.getTime() - new Date(action.deadline).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          });
        }
      });
    });

    return overdue.sort((a, b) => b.daysOverdue - a.daysOverdue);
  },

  getExpiredCertifications: () => {
    const now = new Date();
    const expired: ReturnType<SafetyStore['getExpiredCertifications']> = [];

    get().trainings.forEach((training) => {
      training.participants.forEach((participant) => {
        if (participant.certificateId) {
          // В реальном приложении здесь должна быть проверка срока действия сертификата
          const expiryDate = new Date(now);
          expiryDate.setFullYear(expiryDate.getFullYear() - 1);

          if (expiryDate < now) {
            expired.push({
              employee: {
                id: participant.employeeId,
                name: participant.name,
              },
              certification: {
                type: training.type,
                expiryDate: expiryDate.toISOString(),
              },
              daysExpired: Math.ceil(
                (now.getTime() - expiryDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
            });
          }
        }
      });
    });

    return expired.sort((a, b) => b.daysExpired - a.daysExpired);
  },

  // Поиск и фильтрация
  searchIncidents: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().incidents.filter(
      (incident) =>
        incident.description.toLowerCase().includes(lowercaseQuery) ||
        incident.location.toLowerCase().includes(lowercaseQuery)
    );
  },

  getIncidentsByProject: (projectId) => {
    return get().incidents.filter(
      (incident) => incident.projectId === projectId
    );
  },

  getIncidentsBySeverity: (severity) => {
    return get().incidents.filter(
      (incident) => incident.severity === severity
    );
  },

  getIncidentsByStatus: (status) => {
    return get().incidents.filter(
      (incident) => incident.status === status
    );
  },

  getInspectionsByProject: (projectId) => {
    return get().inspections.filter(
      (inspection) => inspection.projectId === projectId
    );
  },

  getTrainingsByEmployee: (employeeId) => {
    return get().trainings.filter((training) =>
      training.participants.some(
        (participant) => participant.employeeId === employeeId
      )
    );
  },
}));