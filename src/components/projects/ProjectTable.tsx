import React from 'react';
import { Project } from '../../types/project';
import { useProjectStore } from '../../store/projectStore';
import { formatDate } from '../../utils/dateUtils';

export function ProjectTable() {
  const { projects } = useProjectStore();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заказчик</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Наименование объекта</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сроки, приоритет</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Обследование (АКТ)</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Шифр проекта</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Исполнитель</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата передачи в работу</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус РД</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата передачи на проверку</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ТО Энергосвязь</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус ГИП</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Согласование</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус ИД</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата передачи заказчику</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Примечания</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project, index) => (
            <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.customer}</td>
              <td className="px-3 py-2 text-sm text-gray-900">{project.name}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                {formatDate(project.deadline)}
                {project.priority === 'high' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Срочно
                  </span>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                {project.surveyAct ? 'Есть' : 'Нет'}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.code}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.assignee}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                {formatDate(project.startDate)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.rdStatus}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                {formatDate(project.reviewDate)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.toStatus}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.gipStatus}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.approvalStatus}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{project.idStatus}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                {formatDate(project.customerDeliveryDate)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-900">{project.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}