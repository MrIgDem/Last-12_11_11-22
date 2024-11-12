import { Project } from '../types/project';
import { Task } from '../types/task';

// Генерирует список задач для нового проекта
export function generateProjectTasks(project: Project): Omit<Task, 'id' | 'createdAt'>[] {
  const tasks: Omit<Task, 'id' | 'createdAt'>[] = [];

  // Задачи по РД
  tasks.push({
    title: `РД: Разработка рабочей документации - ${project.name}`,
    description: `Разработка комплекта рабочей документации для проекта "${project.name}"`,
    status: 'new',
    priority: project.priority,
    assignee: project.assignee,
    project: project.id,
    projectName: project.name,
    deadline: project.deadline,
    type: 'rd'
  });

  tasks.push({
    title: `РД: Согласование с ТО - ${project.name}`,
    description: `Согласование рабочей документации с техническим отделом для проекта "${project.name}"`,
    status: 'new',
    priority: project.priority,
    assignee: project.assignee,
    project: project.id,
    projectName: project.name,
    deadline: project.deadline,
    type: 'rd'
  });

  tasks.push({
    title: `РД: Проверка ГИПом - ${project.name}`,
    description: `Проверка рабочей документации главным инженером проекта "${project.name}"`,
    status: 'new',
    priority: project.priority,
    assignee: project.assignee,
    project: project.id,
    projectName: project.name,
    deadline: project.deadline,
    type: 'rd'
  });

  // Задачи по ИД
  tasks.push({
    title: `ИД: Подготовка исполнительной документации - ${project.name}`,
    description: `Подготовка комплекта исполнительной документации для проекта "${project.name}"`,
    status: 'new',
    priority: project.priority,
    assignee: project.assignee,
    project: project.id,
    projectName: project.name,
    deadline: project.deadline,
    type: 'id'
  });

  tasks.push({
    title: `ИД: Сбор и оформление актов - ${project.name}`,
    description: `Сбор и оформление необходимых актов для исполнительной документации проекта "${project.name}"`,
    status: 'new',
    priority: project.priority,
    assignee: project.assignee,
    project: project.id,
    projectName: project.name,
    deadline: project.deadline,
    type: 'id'
  });

  // Если требуется обследование
  if (project.surveyAct) {
    tasks.push({
      title: `Обследование объекта - ${project.name}`,
      description: `Проведение обследования объекта и подготовка акта обследования для проекта "${project.name}"`,
      status: 'new',
      priority: project.priority,
      assignee: project.assignee,
      project: project.id,
      projectName: project.name,
      deadline: project.deadline,
      type: 'other'
    });
  }

  return tasks;
}