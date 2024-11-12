export type NotificationType = 
  | 'info' 
  | 'warning' 
  | 'error' 
  | 'success';

export type NotificationCategory =
  | 'project'
  | 'task'
  | 'risk'
  | 'document'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      email: boolean;
      push: boolean;
      minPriority: NotificationPriority;
    };
  };
}

export interface NotificationStore {
  notifications: NotificationItem[];
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: string | null;

  // Methods for notifications
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;

  // Methods for notification preferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  
  // Push notifications
  requestPushPermission: () => Promise<boolean>;
  subscribeToPush: () => Promise<void>;
  unsubscribeFromPush: () => Promise<void>;

  // Email notifications
  updateEmailPreferences: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;

  // Notification retrieval
  getUnreadCount: () => number;
  getNotificationsByCategory: (category: NotificationCategory) => NotificationItem[];
  getRecentNotifications: (limit?: number) => NotificationItem[];
}