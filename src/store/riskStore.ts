import { create } from 'zustand';
import { RiskStore, Risk, RiskAssessment, MitigationAction, RiskMonitoring } from '../types/risk';

export const useRiskStore = create<RiskStore>((set, get) => ({
  risks: [],
  isLoading: false,
  error: null,

  addRisk: (riskData) => {
    set((state) => ({
      risks: [
        ...state.risks,
        {
          ...riskData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateRisk: (id, data) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === id
          ? {
              ...risk,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  removeRisk: (id) => {
    set((state) => ({
      risks: state.risks.filter((risk) => risk.id !== id),
    }));
  },

  addAssessment: (riskId, assessmentData) => {
    const assessment = {
      ...assessmentData,
      id: Math.random().toString(36).substr(2, 9),
    };

    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              assessments: [...risk.assessments, assessment],
              currentAssessment: assessment,
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  updateCurrentAssessment: (riskId, data) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId && risk.currentAssessment
          ? {
              ...risk,
              currentAssessment: {
                ...risk.currentAssessment,
                ...data,
              },
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  addMitigationAction: (riskId, actionData) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              mitigationPlan: {
                ...risk.mitigationPlan,
                actions: [
                  ...risk.mitigationPlan.actions,
                  {
                    ...actionData,
                    id: Math.random().toString(36).substr(2, 9),
                  },
                ],
              },
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  updateMitigationAction: (riskId, actionId, data) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              mitigationPlan: {
                ...risk.mitigationPlan,
                actions: risk.mitigationPlan.actions.map((action) =>
                  action.id === actionId ? { ...action, ...data } : action
                ),
              },
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  removeMitigationAction: (riskId, actionId) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              mitigationPlan: {
                ...risk.mitigationPlan,
                actions: risk.mitigationPlan.actions.filter(
                  (action) => action.id !== actionId
                ),
              },
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  approveMitigationPlan: (riskId, approver) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              mitigationPlan: {
                ...risk.mitigationPlan,
                approvedBy: approver,
                approvedAt: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  addMonitoringRecord: (riskId, recordData) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              monitoringHistory: [
                ...risk.monitoringHistory,
                {
                  ...recordData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  updateMonitoringRecord: (riskId, recordId, data) => {
    set((state) => ({
      risks: state.risks.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              monitoringHistory: risk.monitoringHistory.map((record) =>
                record.id === recordId ? { ...record, ...data } : record
              ),
              updatedAt: new Date().toISOString(),
            }
          : risk
      ),
    }));
  },

  generateRiskMatrix: () => {
    const risks = get().risks;
    const matrix: ReturnType<RiskStore['generateRiskMatrix']> = [];
    const probabilities: RiskProbability[] = ['very_low', 'low', 'medium', 'high', 'very_high'];
    const impacts: RiskImpact[] = ['negligible', 'minor', 'moderate', 'major', 'severe'];

    probabilities.forEach(probability => {
      impacts.forEach(impact => {
        matrix.push({
          probability,
          impact,
          risks: risks.filter(risk => 
            risk.currentAssessment?.probability === probability &&
            risk.currentAssessment?.impact === impact
          )
        });
      });
    });

    return matrix;
  },

  generateRiskReport: async (projectId) => {
    // Здесь должна быть реализация генерации отчета
    // Возвращаем заглушку
    return new Blob([''], { type: 'application/pdf' });
  },

  calculateRiskExposure: (projectId) => {
    const projectRisks = get().getRisksByProject(projectId);
    const exposure = {
      total: 0,
      byCategory: {} as Record<string, number>,
      trend: [] as Array<{ date: string; value: number }>,
    };

    // Расчет текущего воздействия рисков
    projectRisks.forEach(risk => {
      if (risk.currentAssessment) {
        const value = risk.currentAssessment.financialImpact || 0;
        exposure.total += value;
        
        if (!exposure.byCategory[risk.category]) {
          exposure.byCategory[risk.category] = 0;
        }
        exposure.byCategory[risk.category] += value;
      }
    });

    // Расчет тренда (за последние 6 месяцев)
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthlyValue = projectRisks.reduce((sum, risk) => {
        const assessment = risk.assessments.find(a => 
          new Date(a.assessedAt).getMonth() === date.getMonth() &&
          new Date(a.assessedAt).getFullYear() === date.getFullYear()
        );
        return sum + (assessment?.financialImpact || 0);
      }, 0);

      exposure.trend.push({
        date: date.toISOString(),
        value: monthlyValue,
      });
    }

    return exposure;
  },

  getHighPriorityRisks: () => {
    return get().risks.filter(
      risk => risk.currentAssessment?.priority === 'high' || risk.currentAssessment?.priority === 'critical'
    );
  },

  getUpcomingMitigationActions: (days) => {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    const upcomingActions: ReturnType<RiskStore['getUpcomingMitigationActions']> = [];

    get().risks.forEach(risk => {
      risk.mitigationPlan.actions.forEach(action => {
        if (action.status === 'planned' || action.status === 'in_progress') {
          const actionDeadline = new Date(action.deadline);
          if (actionDeadline >= now && actionDeadline <= deadline) {
            upcomingActions.push({
              risk,
              action,
              daysLeft: Math.ceil((actionDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            });
          }
        }
      });
    });

    return upcomingActions.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  getOverdueMitigationActions: () => {
    const now = new Date();
    const overdueActions: ReturnType<RiskStore['getOverdueMitigationActions']> = [];

    get().risks.forEach(risk => {
      risk.mitigationPlan.actions.forEach(action => {
        if ((action.status === 'planned' || action.status === 'in_progress') && new Date(action.deadline) < now) {
          overdueActions.push({
            risk,
            action,
            daysOverdue: Math.ceil((now.getTime() - new Date(action.deadline).getTime()) / (1000 * 60 * 60 * 24)),
          });
        }
      });
    });

    return overdueActions.sort((a, b) => b.daysOverdue - a.daysOverdue);
  },

  searchRisks: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().risks.filter(
      risk =>
        risk.title.toLowerCase().includes(lowercaseQuery) ||
        risk.description.toLowerCase().includes(lowercaseQuery)
    );
  },

  getRisksByProject: (projectId) => {
    return get().risks.filter(risk => risk.projectId === projectId);
  },

  getRisksByCategory: (category) => {
    return get().risks.filter(risk => risk.category === category);
  },

  getRisksByStatus: (status) => {
    return get().risks.filter(risk => risk.status === status);
  },

  getRisksByPriority: (priority) => {
    return get().risks.filter(risk => risk.currentAssessment?.priority === priority);
  },

  getRisksByOwner: (owner) => {
    return get().risks.filter(risk => risk.owner === owner);
  },
}));