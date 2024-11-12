import { create } from 'zustand';
import { 
  NotificationStore, 
  NotificationPreferences, 
  NotificationItem,
  NotificationCategory 
} from '../types/notification';

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  categories: {
    project: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'medium',
    },
    task: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'medium',
    },
    risk: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'low',
    },
    document: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'medium',
    },
    system: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'high',
    },
  },
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  preferences: defaultPreferences,
  isLoading: false,
  error: null,

  addNotification: (notificationData) => {
    const notification: NotificationItem = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false,
    };

    set(state => ({
      notifications: [notification, ...state.notifications],
    }));

    // Handle browser notifications if enabled
    if (get().preferences.push && 
        get().preferences.categories[notification.category].push &&
        'Notification' in window &&
        Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png',
      });
    }

    // Handle email notifications if enabled
    if (get().preferences.email && 
        get().preferences.categories[notification.category].email) {
      // Email notification logic would go here
    }
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },

  deleteNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  updatePreferences: (preferences) => {
    set(state => ({
      preferences: {
        ...state.preferences,
        ...preferences,
      },
    }));
  },

  requestPushPermission: async () => {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const permission = await window.Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request push permission:', error);
      return false;
    }
  },

  subscribeToPush: async () => {
    try {
      const permission = await get().requestPushPermission();
      if (permission) {
        set(state => ({
          preferences: {
            ...state.preferences,
            push: true,
          },
        }));
      }
    } catch (error) {
      set({ error: 'Failed to subscribe to push notifications' });
    }
  },

  unsubscribeFromPush: async () => {
    try {
      set(state => ({
        preferences: {
          ...state.preferences,
          push: false,
        },
      }));
    } catch (error) {
      set({ error: 'Failed to unsubscribe from push notifications' });
    }
  },

  updateEmailPreferences: async (email: string) => {
    try {
      set(state => ({
        preferences: {
          ...state.preferences,
          email: true,
        },
      }));
    } catch (error) {
      set({ error: 'Failed to update email preferences' });
    }
  },

  verifyEmail: async (token: string) => {
    try {
      // Email verification logic would go here
      return true;
    } catch (error) {
      set({ error: 'Failed to verify email' });
      return false;
    }
  },

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  getNotificationsByCategory: (category: NotificationCategory) => {
    return get().notifications.filter(n => n.category === category);
  },

  getRecentNotifications: (limit = 10) => {
    return get().notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
}));