export type MetricPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type MetricType = 'count' | 'percentage' | 'currency' | 'duration';

export interface Metric {
  id: string;
  name: string;
  value: number;
  type: MetricType;
  period: MetricPeriod;
  trend: number;
  previousValue?: number;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: Array<{
    date: string;
    [key: string]: any;
  }>;
  series: Array<{
    name: string;
    key: string;
    color?: string;
  }>;
}

export interface Report {
  id: string;
  title: string;
  type: 'project' | 'task' | 'financial' | 'resource';
  format: 'pdf' | 'excel' | 'word';
  generatedAt: string;
  url: string;
  parameters?: Record<string, any>;
}

export interface AnalyticsStore {
  metrics: Metric[];
  charts: ChartData[];
  reports: Report[];
  isLoading: boolean;
  error: string | null;

  // Методы для метрик
  getMetrics: (period: MetricPeriod) => Metric[];
  updateMetrics: () => Promise<void>;

  // Методы для графиков
  getChartData: (chartId: string, period: MetricPeriod) => ChartData | null;
  updateChartData: (chartId: string) => Promise<void>;

  // Методы для отчетов
  generateReport: (type: Report['type'], parameters?: Record<string, any>) => Promise<string>;
  getReports: () => Report[];
  deleteReport: (id: string) => void;
}