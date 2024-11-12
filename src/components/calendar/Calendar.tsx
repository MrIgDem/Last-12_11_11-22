import React, { useState, useMemo } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export function Calendar() {
  const { selectedDate, setSelectedDate } = useCalendarStore();
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Get events for the current month
  const events = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // Get task events
    const taskEvents = tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate >= monthStart && taskDate <= monthEnd;
    }).map(task => ({
      date: new Date(task.deadline),
      type: 'task' as const,
      title: task.title,
      status: task.status,
      priority: task.priority
    }));

    // Get project stage events
    const stageEvents = projects.flatMap(project =>
      project.stages.filter(stage => {
        const stageStart = new Date(stage.startDate);
        const stageEnd = new Date(stage.endDate);
        return (stageStart >= monthStart && stageStart <= monthEnd) ||
               (stageEnd >= monthStart && stageEnd <= monthEnd) ||
               (stageStart <= monthStart && stageEnd >= monthEnd);
      }).map(stage => ({
        date: new Date(stage.startDate),
        endDate: new Date(stage.endDate),
        type: 'stage' as const,
        title: stage.name,
        status: stage.status,
        projectName: project.name
      }))
    );

    // Get project milestone events
    const projectEvents = projects.map(project => ({
      date: new Date(project.deadline),
      type: 'project' as const,
      title: project.name,
      status: project.rdStatus,
      priority: project.priority
    })).filter(event => 
      event.date >= monthStart && event.date <= monthEnd
    );

    return [...taskEvents, ...stageEvents, ...projectEvents];
  }, [tasks, projects, currentMonth]);

  const getEventIndicators = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayEvents = events.filter(event => {
      if (event.type === 'stage') {
        const startDate = new Date(event.date);
        const endDate = new Date(event.endDate);
        return date >= startDate && date <= endDate;
      }
      return event.date.getDate() === day;
    });

    return dayEvents.map((event, index) => {
      let bgColor = 'bg-gray-400';
      
      if (event.type === 'task') {
        if (event.status === 'completed') bgColor = 'bg-green-400';
        else if (event.priority === 'high') bgColor = 'bg-red-400';
        else if (event.status === 'in_progress') bgColor = 'bg-yellow-400';
      } else if (event.type === 'stage') {
        if (event.status === 'completed') bgColor = 'bg-green-400';
        else if (event.status === 'in_progress') bgColor = 'bg-yellow-400';
        else if (event.status === 'review') bgColor = 'bg-blue-400';
      } else if (event.type === 'project') {
        if (event.priority === 'high') bgColor = 'bg-red-400';
        else bgColor = 'bg-indigo-400';
      }

      return (
        <div
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${bgColor} mx-0.5`}
          title={`${event.title}${event.type === 'stage' ? ` (${event.projectName})` : ''}`}
        />
      );
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    // Render week days
    weekDays.forEach((day) => {
      days.push(
        <div key={`weekday-${day}`} className="font-medium text-gray-500 text-center py-2">
          {day}
        </div>
      );
    });

    // Empty cells before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isToday = new Date().toDateString() === date.toDateString();
      const dayEvents = getEventIndicators(day);

      days.push(
        <button
          key={`day-${day}`}
          onClick={() => handleDateClick(day)}
          className={`p-1 flex flex-col items-center rounded-lg hover:bg-gray-100 ${
            isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''
          } ${isToday ? 'border border-indigo-600' : ''}`}
        >
          <span className="text-sm">{day}</span>
          {dayEvents.length > 0 && (
            <div className="flex mt-1">
              {dayEvents}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
          {currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-red-400 mr-1" />
          <span>Высокий приоритет</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-yellow-400 mr-1" />
          <span>В работе</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-400 mr-1" />
          <span>Завершено</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-indigo-400 mr-1" />
          <span>Проект</span>
        </div>
      </div>
    </div>
  );
}