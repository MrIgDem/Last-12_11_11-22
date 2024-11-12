import React from 'react';
import { Report } from '../../types/analytics';
import { FileText, Download, Trash2 } from 'lucide-react';
import { useAnalyticsStore } from '../../store/analyticsStore';

interface ReportListProps {
  reports: Report[];
}

export function ReportList({ reports }: ReportListProps) {
  const { deleteReport } = useAnalyticsStore();

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {report.title}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(report.generatedAt).toLocaleString('ru-RU')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={report.url}
              download
              className="text-indigo-600 hover:text-indigo-900"
            >
              <Download className="h-5 w-5" />
            </a>
            <button
              onClick={() => deleteReport(report.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}

      {reports.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          Нет доступных отчетов
        </p>
      )}
    </div>
  );
}