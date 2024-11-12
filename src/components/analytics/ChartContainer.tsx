import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

export function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}