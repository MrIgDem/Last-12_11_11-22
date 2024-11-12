import { User } from '../types/auth';
import { Project } from '../types/project';
import { Task } from '../types/task';

export function canViewProject(user: User, project: Project): boolean {
  // Администраторы и директора видят все проекты
  if (user.accessLevel === 'admin' || user.role === 'director') {
    return true;
  }

  // Менеджеры видят все проекты
  if (user.role === 'manager') {
    return true;
  }

  // Инженеры видят только свои проекты
  if (user.role === 'engineer') {
    return project.assignee === user.name;
  }

  // Монтажники видят только проекты, где у них есть задачи
  if (user.role === 'installer') {
    // Здесь должна быть проверка задач монтажника в проекте
    return false;
  }

  return false;
}

export function canEditProject(user: User, project: Project): boolean {
  // Администраторы и директора могут редактировать все проекты
  if (user.accessLevel === 'admin' || user.role === 'director') {
    return true;
  }

  // Менеджеры могут редактировать все проекты
  if (user.role === 'manager') {
    return true;
  }

  // Инженеры могут редактировать только свои проекты
  if (user.role === 'engineer') {
    return project.assignee === user.name;
  }

  return false;
}

export function canViewTask(user: User, task: Task): boolean {
  // Администраторы и директора видят все задачи
  if (user.accessLevel === 'admin' || user.role === 'director') {
    return true;
  }

  // Менеджеры видят все задачи
  if (user.role === 'manager') {
    return true;
  }

  // Инженеры и монтажники видят только свои задачи
  if (user.role === 'engineer' || user.role === 'installer') {
    return task.assignee === user.name;
  }

  return false;
}

export function canEditTask(user: User, task: Task): boolean {
  // Администраторы и директора могут редактировать все задачи
  if (user.accessLevel === 'admin' || user.role === 'director') {
    return true;
  }

  // Менеджеры могут редактировать все задачи
  if (user.role === 'manager') {
    return true;
  }

  // Инженеры и монтажники могут редактировать только свои задачи
  if (user.role === 'engineer' || user.role === 'installer') {
    return task.assignee === user.name;
  }

  return false;
}

export function canAttachFiles(user: User, item: Project | Task): boolean {
  // Администраторы и директора всегда могут прикреплять файлы
  if (user.accessLevel === 'admin' || user.role === 'director') {
    return true;
  }

  // Менеджеры всегда могут прикреплять файлы
  if (user.role === 'manager') {
    return true;
  }

  // Для проектов и задач проверяем, является ли пользователь исполнителем
  return 'assignee' in item && item.assignee === user.name;
}