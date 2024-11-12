import { Project, DocumentStatus } from '../types/project';
import { Task } from '../types/task';
import { Employee } from '../types/employee';
import { Material } from '../types/material';
import { Equipment } from '../types/equipment';
import { StockItem } from '../types/inventory';
import { GeoPoint, FiberLine } from '../types/map';

// Test data for projects
export const testProjects: Project[] = [
  {
    id: 'proj-001',
    type: 'b2b',
    customer: 'ООО "ТехноСвязь"',
    name: 'Строительство ВОЛС Москва-Казань',
    deadline: '2024-12-31',
    priority: 'high',
    surveyAct: true,
    code: 'MSK-KZN-001',
    assignee: 'Иванов И.И.',
    startDate: '2024-01-15',
    stages: [
      {
        id: 'stage-001',
        name: 'Проектирование',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        status: 'completed',
        completionPercentage: 100
      },
      {
        id: 'stage-002',
        name: 'Строительство',
        startDate: '2024-02-16',
        endDate: '2024-06-30',
        status: 'in_progress',
        completionPercentage: 45
      }
    ],
    rdStatus: 'approved',
    rdReviewDate: '2024-02-01',
    rdApprovalDate: '2024-02-10',
    rdComments: 'Замечания устранены',
    idStatus: 'in_progress',
    idStartDate: '2024-02-16',
    toStatus: 'Согласовано',
    gipStatus: 'Проверено',
    approvalStatus: 'Согласовано',
    notes: 'Приоритетный проект'
  },
  {
    id: 'proj-002',
    type: 'government',
    customer: 'Министерство связи',
    name: 'Подключение социальных объектов',
    deadline: '2024-09-30',
    priority: 'medium',
    surveyAct: true,
    code: 'SOC-002',
    assignee: 'Петров П.П.',
    startDate: '2024-03-01',
    stages: [
      {
        id: 'stage-003',
        name: 'Обследование',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        status: 'in_progress',
        completionPercentage: 60
      }
    ],
    rdStatus: 'in_progress',
    idStatus: 'not_started',
    toStatus: 'На проверке',
    gipStatus: 'В работе',
    approvalStatus: 'На согласовании',
    notes: 'Социально значимый проект'
  }
];

// Test data for tasks
export const testTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Разработка схемы трассы',
    description: 'Разработать схему прокладки ВОЛС с учетом существующей инфраструктуры',
    status: 'completed',
    priority: 'high',
    assignee: 'Иванов И.И.',
    project: 'proj-001',
    projectName: 'Строительство ВОЛС Москва-Казань',
    deadline: '2024-02-01',
    type: 'rd',
    createdAt: '2024-01-15'
  },
  {
    id: 'task-002',
    title: 'Обследование объектов',
    description: 'Провести обследование социальных объектов для подключения',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Петров П.П.',
    project: 'proj-002',
    projectName: 'Подключение социальных объектов',
    deadline: '2024-03-15',
    type: 'rd',
    createdAt: '2024-03-01'
  }
];

// Test data for employees
export const testEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Иванов Иван Иванович',
    role: 'engineer',
    department: 'engineering',
    position: 'Главный инженер проекта',
    email: 'ivanov@example.com',
    phone: '+7 (999) 123-45-67',
    subordinates: ['emp-003'],
    createdAt: '2024-01-01'
  },
  {
    id: 'emp-002',
    name: 'Петров Петр Петрович',
    role: 'engineer',
    department: 'engineering',
    position: 'Инженер-проектировщик',
    email: 'petrov@example.com',
    phone: '+7 (999) 234-56-78',
    subordinates: [],
    createdAt: '2024-01-01'
  },
  {
    id: 'emp-003',
    name: 'Сидоров Сидор Сидорович',
    role: 'installer',
    department: 'installation',
    position: 'Бригадир монтажников',
    email: 'sidorov@example.com',
    phone: '+7 (999) 345-67-89',
    subordinates: [],
    createdAt: '2024-01-01'
  }
];

// Test data for materials
export const testMaterials: Material[] = [
  {
    id: 'mat-001',
    name: 'Кабель оптический',
    manufacturer: 'КабельСтрой',
    type: 'Кабель',
    productionDate: '2024-01-01',
    expiryDate: '2026-01-01',
    specifications: 'Волокон: 32, Тип: SM',
    createdAt: '2024-01-15'
  },
  {
    id: 'mat-002',
    name: 'Муфта оптическая',
    manufacturer: 'ОптикПро',
    type: 'Муфта',
    productionDate: '2024-01-01',
    expiryDate: '2029-01-01',
    specifications: 'Количество портов: 48',
    createdAt: '2024-01-15'
  }
];

// Test data for equipment
export const testEquipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Рефлектометр',
    type: 'Измерительное оборудование',
    serialNumber: 'OTDR-001',
    verifications: [
      {
        id: 'ver-001',
        equipmentId: 'eq-001',
        type: 'calibration',
        date: '2024-01-01',
        nextDate: '2025-01-01',
        notes: 'Калибровка выполнена',
        createdAt: '2024-01-01'
      }
    ]
  },
  {
    id: 'eq-002',
    name: 'Сварочный аппарат',
    type: 'Монтажное оборудование',
    serialNumber: 'FSM-002',
    verifications: [
      {
        id: 'ver-002',
        equipmentId: 'eq-002',
        type: 'maintenance',
        date: '2024-02-01',
        nextDate: '2024-05-01',
        notes: 'ТО выполнено',
        createdAt: '2024-02-01'
      }
    ]
  }
];

// Test data for inventory
export const testInventory: StockItem[] = [
  {
    id: 'inv-001',
    type: 'cable',
    name: 'Кабель оптический',
    code: 'CABLE-001',
    manufacturer: 'КабельСтрой',
    model: 'ОК-32',
    status: 'available',
    location: 'Склад 1',
    quantity: 5000,
    unit: 'м',
    minQuantity: 1000,
    maxQuantity: 10000,
    price: 50,
    notes: 'Основной склад',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'inv-002',
    type: 'equipment',
    name: 'Муфта оптическая',
    code: 'SPLICE-001',
    manufacturer: 'ОптикПро',
    model: 'M-48',
    status: 'available',
    location: 'Склад 2',
    quantity: 50,
    unit: 'шт',
    minQuantity: 10,
    maxQuantity: 100,
    price: 2000,
    notes: 'Резервный склад',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Test data for map
export const testMapPoints: GeoPoint[] = [
  {
    id: 'point-001',
    lat: 55.7558,
    lng: 37.6173,
    type: 'node',
    name: 'Узел 1',
    description: 'Главный узел',
    status: 'completed'
  },
  {
    id: 'point-002',
    lat: 55.7959,
    lng: 37.6273,
    type: 'equipment',
    name: 'Муфта 1',
    description: 'Оптическая муфта',
    status: 'in_progress'
  }
];

export const testMapLines: FiberLine[] = [
  {
    id: 'line-001',
    points: ['point-001', 'point-002'],
    type: 'underground',
    length: 1500,
    fiberCount: 32,
    status: 'in_progress'
  }
];