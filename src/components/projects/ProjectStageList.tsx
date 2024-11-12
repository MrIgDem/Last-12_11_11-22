import React from 'react';
import { ProjectStage } from '../../types/project';
import { Calendar, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProjectStageListProps {
  stages: ProjectStage[];
  onStageClick?: (stage: ProjectStage) => void;
}

export function ProjectStageList({ stages, onStageClick }: ProjectStageListProps) {
  const getStatusColor = (status: ProjectStage['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ProjectStage['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'review': return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'revision': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          onClick={() => onStageClick?.(stage)}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(stage.status)}
              <h3 className="text-lg font-medium text-gray-900">{stage.name}</h3>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
              {stage.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1.5" />
              <div className="flex items-center">
                {new Date(stage.startDate).toLocaleDateString('ru-RU')}
                <ArrowRight className="h-4 w-4 mx-1" />
                {new Date(stage.endDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-full max-w-[200px]">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Прогресс</span>
                  <span>{stage.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${stage.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {stage.dependencies && stage.dependencies.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Зависит от: {stage.dependencies.join(', ')}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}