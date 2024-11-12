import React from 'react';
import { useResourceStore } from '../../store/resourceStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResourceUtilizationChartProps {
  resourceId: string;
  startDate: string;
  endDate: string;
}

export function ResourceUtilizationChart({ resourceId, startDate, endDate }: ResourceUtilizationChartProps) {
  const { getResourceUtilization } = useResourceStore();
  const utilization = getResourceUtilization(resourceId, startDate, endDate);

  const data = [
    {
      name: 'Использование',
      capacity: utilization.capacity,
      allocated: utilization.allocated,
      available: utilization.capacity - utilization.allocated,
    },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="allocated" stackId="a" fill="#82ca9d" name="Использовано" />
          <Bar dataKey="available" stackId="a" fill="#8884d8" name="Доступно" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Коэффициент использования: {(utilization.utilizationRate * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}