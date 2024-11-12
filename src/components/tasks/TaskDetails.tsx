import React from 'react';
import { Task } from '../../types/task';
import { X, Clock, AlertCircle, User, Briefcase, Paperclip, Download, Trash2 } from 'lucide-react';
import { DocumentUpload } from '../documents/DocumentUpload';
import { useAuthStore } from '../../store/authStore';
import { canAttachFiles } from '../../utils/accessControl';
import { useTaskStore } from '../../store/taskStore';

interface TaskDetailsProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetails({ task, isOpen, onClose }: TaskDetailsProps) {
  const { user } = useAuthStore();
  const { updateTask } = useTaskStore();

  if (!isOpen || !user) return null;

  const canAttach = canAttachFiles(user, task);

  const handleFileUpload = (files: File[]) => {
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      uploadedBy: user.name,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));

    updateTask(task.id, {
      attachments: [...(task.attachments || []), ...newAttachments]
    });
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    const newAttachments = (task.attachments || []).filter(
      attachment => attachment.id !== attachmentId
    );
    updateTask(task.id, { attachments: newAttachments });
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершена';
      case 'blocked': return 'Заблокирована';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-medium text-gray-900">
                {task.title}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>

            <div className="mt-4 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Описание</h4>
                <p className="mt-1 text-sm text-gray-900">{task.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500">
                      <User className="h-5 w-5 mr-2" />
                      Исполнитель
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{task.assignee}</dd>
                  </div>

                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Проект
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{task.projectName}</dd>
                  </div>

                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500">
                      <Clock className="h-5 w-5 mr-2" />
                      Срок выполнения
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.deadline).toLocaleDateString('ru-RU')}
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500">
                      <AlertCircle className={`h-5 w-5 mr-2 ${getPriorityColor(task.priority)}`} />
                      Приоритет
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {task.priority === 'high' ? 'Высокий' : 
                       task.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-4">
                  Прикрепленные файлы
                </h4>
                
                {canAttach && (
                  <div className="mb-4">
                    <DocumentUpload onUpload={handleFileUpload} />
                  </div>
                )}

                {task.attachments && task.attachments.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {task.attachments.map(attachment => (
                      <li key={attachment.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <Paperclip className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-gray-500">
                              Добавил: {attachment.uploadedBy} • {new Date(attachment.uploadedAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={attachment.url}
                            download={attachment.name}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                          {canAttach && (
                            <button
                              onClick={() => handleRemoveAttachment(attachment.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Нет прикрепленных файлов</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}