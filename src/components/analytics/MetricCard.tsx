import React from 'react';
import { Metric } from '../../types/analytics';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const formatValue = (value: number, type: Metric['type']) => {
    switch (type) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          maximumFractionDigits: 0,
        }).format(value);
      case 'duration':
        return `${value} дн.`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">
              {metric.name}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {formatValue(metric.value, metric.type)}
            </p>
          </div>
          {metric.trend !== 0 && (
            <div className={`flex items-center ${
              metric.trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend > 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="ml-1 text-sm">
                {Math.abs(metric.trend)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}