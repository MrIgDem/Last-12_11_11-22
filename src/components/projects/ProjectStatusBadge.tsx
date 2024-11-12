import React from 'react';
import { DocumentStatus } from '../../types/project';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

interface ProjectStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className = '' }: ProjectStatusBadgeProps) {
  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case 'not_started':
        return {
          icon: Clock,
          text: 'Не начат',
          color: 'bg-gray-100 text-gray-800'
        };
      case 'in_progress':
        return {
          icon: Clock,
          text: 'В работе',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'review':
        return {
          icon: AlertCircle,
          text: 'На проверке',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'revision':
        return {
          icon: XCircle,
          text: 'На доработке',
          color: 'bg-orange-100 text-orange-800'
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          text: 'Согласован',
          color: 'bg-green-100 text-green-800'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Завершен',
          color: 'bg-indigo-100 text-indigo-800'
        };
      default:
        return {
          icon: Clock,
          text: status,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const { icon: Icon, text, color } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      {text}
    </span>
  );
}