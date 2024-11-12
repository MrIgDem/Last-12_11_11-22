import { create } from 'zustand';
import { Schedule, ScheduleTask } from '../types/calendar';

interface CalendarState {
  schedules: Schedule[];
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
  
  setSelectedDate: (date: Date) => void;
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, data: Partial<Schedule>) => void;
  removeSchedule: (id: string) => void;
  
  // Task operations
  addTask: (scheduleId: string, task: Omit<ScheduleTask, 'id'>) => void;
  updateTask: (scheduleId: string, taskId: string, data: Partial<ScheduleTask>) => void;
  removeTask: (scheduleId: string, taskId: string) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  schedules: [],
  selectedDate: new Date(),
  isLoading: false,
  error: null,

  setSelectedDate: (date) => set({ selectedDate: date }),

  addSchedule: (scheduleData) => {
    set((state) => ({
      schedules: [
        ...state.schedules,
        {
          ...scheduleData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    }));
  },

  updateSchedule: (id, data) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, ...data } : schedule
      ),
    }));
  },

  removeSchedule: (id) => {
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== id),
    }));
  },

  addTask: (scheduleId, taskData) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: [
                ...schedule.tasks,
                {
                  ...taskData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
            }
          : schedule
      ),
    }));
  },

  updateTask: (scheduleId, taskId, data) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: schedule.tasks.map((task) =>
                task.id === taskId ? { ...task, ...data } : task
              ),
            }
          : schedule
      ),
    }));
  },

  removeTask: (scheduleId, taskId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: schedule.tasks.filter((task) => task.id !== taskId),
            }
          : schedule
      ),
    }));
  },
}));