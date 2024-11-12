import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { X } from 'lucide-react';

interface NotificationPreferencesProps {
  onClose: () => void;
}

export function NotificationPreferences({ onClose }: NotificationPreferencesProps) {
  const { preferences, updatePreferences, requestPushPermission } = useNotificationStore();

  const handlePushToggle = async () => {
    if (!preferences.push) {
      const granted = await requestPushPermission();
      if (granted) {
        updatePreferences({ push: true });
      }
    } else {
      updatePreferences({ push: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Настройки уведомлений
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Общие настройки
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Push-уведомления</span>
                  <button
                    onClick={handlePushToggle}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      preferences.push ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.push ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email-уведомления</span>
                  <button
                    onClick={() => updatePreferences({ email: !preferences.email })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      preferences.email ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.email ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Настройки по категориям
              </h3>
              <div className="space-y-4">
                {Object.entries(preferences.categories).map(([category, settings]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-900">
                        {category === 'project' ? 'Проекты' :
                         category === 'task' ? 'Задачи' :
                         category === 'risk' ? 'Риски' :
                         category === 'document' ? 'Документы' : 'Система'}
                      </span>
                      <button
                        onClick={() => updatePreferences({
                          categories: {
                            ...preferences.categories,
                            [category]: {
                              ...settings,
                              enabled: !settings.enabled
                            }
                          }
                        })}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          settings.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {settings.enabled && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Email</span>
                          <button
                            onClick={() => updatePreferences({
                              categories: {
                                ...preferences.categories,
                                [category]: {
                                  ...settings,
                                  email: !settings.email
                                }
                              }
                            })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                              settings.email ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                settings.email ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Push</span>
                          <button
                            onClick={() => updatePreferences({
                              categories: {
                                ...preferences.categories,
                                [category]: {
                                  ...settings,
                                  push: !settings.push
                                }
                              }
                            })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                              settings.push ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                settings.push ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Минимальный приоритет
                          </label>
                          <select
                            value={settings.minPriority}
                            onChange={(e) => updatePreferences({
                              categories: {
                                ...preferences.categories,
                                [category]: {
                                  ...settings,
                                  minPriority: e.target.value as any
                                }
                              }
                            })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="low">Низкий</option>
                            <option value="medium">Средний</option>
                            <option value="high">Высокий</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}