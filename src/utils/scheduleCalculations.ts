import { ScheduleTask } from '../types/calendar';

export function calculateCriticalPathForTasks(tasks: ScheduleTask[]) {
  // Sort tasks by dependencies
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.dependencies.some(dep => dep.successorId === b.id)) return 1;
    if (b.dependencies.some(dep => dep.successorId === a.id)) return -1;
    return 0;
  });

  // Calculate earliest start and finish times
  sortedTasks.forEach(task => {
    const dependencyEndTimes = task.dependencies.map(dep => {
      const predecessor = tasks.find(t => t.id === dep.predecessorId);
      return predecessor ? new Date(predecessor.endDate).getTime() : 0;
    });

    const maxDependencyEnd = Math.max(0, ...dependencyEndTimes);
    const startDate = new Date(Math.max(new Date(task.startDate).getTime(), maxDependencyEnd));
    const endDate = new Date(startDate.getTime() + task.duration * 24 * 60 * 60 * 1000);

    task.startDate = startDate.toISOString();
    task.endDate = endDate.toISOString();
  });

  // Find critical path
  const criticalPath = sortedTasks
    .filter(task => task.slack === 0)
    .map(task => task.id);

  return {
    criticalPath,
    tasks: sortedTasks,
  };
}

export function calculateTaskProgress(tasks: ScheduleTask[]) {
  if (tasks.length === 0) return 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  return (completedTasks / totalTasks) * 100;
}