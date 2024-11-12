import React, { useState } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { Bell, Settings, Check, Trash2 } from 'lucide-react';
import { NotificationPreferences } from './NotificationPreferences';

export function NotificationCenter() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
  } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const unreadCount = getUnreadCount();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25" 
            style={{ zIndex: 40 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification panel */}
          <div 
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
            style={{ zIndex: 50 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Уведомления
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg ${
                        notification.read ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                            getNotificationIcon(notification.type)
                          }`}>
                            <Bell className="h-5 w-5" />
                          </span>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Нет уведомлений
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showPreferences && (
        <NotificationPreferences onClose={() => setShowPreferences(false)} />
      )}
    </div>
  );
}