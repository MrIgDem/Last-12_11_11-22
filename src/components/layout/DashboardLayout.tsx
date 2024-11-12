import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardList,
  Settings,
  Users,
  Building2,
  Wrench,
  Package,
  LogOut,
  Menu as MenuIcon,
  X,
  FileText,
  Map,
  ChevronDown,
  Boxes
} from 'lucide-react';
import { User, Role, AccessLevel } from '../../types/auth';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

const roleRoutes: Record<Role, string[]> = {
  director: [
    '/dashboard',
    '/projects',
    '/tasks',
    '/employees',
    '/settings',
    '/settings/organization',
    '/settings/equipment',
    '/settings/materials',
    '/documents',
    '/map',
    '/inventory'
  ],
  manager: [
    '/dashboard',
    '/projects',
    '/tasks',
    '/employees',
    '/documents',
    '/map',
    '/inventory'
  ],
  engineer: [
    '/dashboard',
    '/tasks',
    '/documents',
    '/map',
    '/inventory'
  ],
  installer: [
    '/dashboard',
    '/tasks',
    '/map',
    '/inventory'
  ],
  contractor: [
    '/dashboard',
    '/tasks'
  ]
};

const getNavigationItems = (role: Role, accessLevel: AccessLevel) => {
  const baseItems = [
    { name: 'Главная', icon: LayoutDashboard, href: '/dashboard' }
  ];

  const projectItems = [
    { name: 'Проекты', icon: Briefcase, href: '/projects' },
    { name: 'Задачи', icon: ClipboardList, href: '/tasks' }
  ];

  const documentItems = [
    { name: 'Документы', icon: FileText, href: '/documents' }
  ];

  const mapItems = [
    { name: 'Карта', icon: Map, href: '/map' }
  ];

  const inventoryItems = [
    { name: 'Склад', icon: Boxes, href: '/inventory' }
  ];

  const settingsItems = [
    { 
      name: 'Настройки', 
      icon: Settings, 
      href: '/settings',
      isExpandable: true,
      subItems: [
        { name: 'Организация', icon: Building2, href: '/settings/organization' },
        { name: 'Оборудование', icon: Wrench, href: '/settings/equipment' },
        { name: 'Материалы', icon: Package, href: '/settings/materials' },
      ]
    }
  ];

  const adminItems = [
    { name: 'Сотрудники', icon: Users, href: '/employees' }
  ];

  switch (role) {
    case 'director':
      return [...baseItems, ...projectItems, ...documentItems, ...mapItems, ...inventoryItems, ...adminItems, ...settingsItems];
    case 'manager':
      return [...baseItems, ...projectItems, ...documentItems, ...mapItems, ...inventoryItems];
    case 'engineer':
      return [...baseItems, { name: 'Задачи', icon: ClipboardList, href: '/tasks' }, ...documentItems, ...mapItems, ...inventoryItems];
    case 'installer':
      return [...baseItems, { name: 'Задачи', icon: ClipboardList, href: '/tasks' }, ...mapItems, ...inventoryItems];
    case 'contractor':
      return [...baseItems, { name: 'Задачи', icon: ClipboardList, href: '/tasks' }];
    default:
      return baseItems;
  }
};

export function DashboardLayout({ user, children, onLogout }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = getNavigationItems(user.role, user.accessLevel);

  const hasAccess = (path: string) => {
    return roleRoutes[user.role].includes(path);
  };

  const isActiveRoute = (path: string) => location.pathname === path;
  const isActiveParent = (item: any) => {
    if (item.subItems) {
      return item.subItems.some((subItem: any) => location.pathname.startsWith(subItem.href));
    }
    return location.pathname === item.href;
  };

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const renderNavItem = (item: any, depth = 0) => {
    const isActive = isActiveRoute(item.href);
    const isParentActive = isActiveParent(item);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.name);

    if (!hasAccess(item.href)) {
      return null;
    }

    return (
      <div key={item.name} className={`ml-${depth * 4}`}>
        <button
          onClick={() => {
            if (item.isExpandable) {
              toggleMenu(item.name);
            } else {
              navigate(item.href);
            }
          }}
          className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white transition-colors ${
            isActive || isParentActive ? 'bg-indigo-800' : 'hover:bg-indigo-600'
          }`}
        >
          <item.icon className="mr-3 h-5 w-5" />
          <span className="flex-1 text-left">{item.name}</span>
          {hasSubItems && (
            <ChevronDown 
              className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
            />
          )}
        </button>

        {hasSubItems && isExpanded && (
          <div className="mt-1 ml-4 space-y-1">
            {item.subItems.map((subItem: any) => renderNavItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-indigo-700">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-white">АСУ ЛС</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => renderNavItem(item))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-indigo-800 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-indigo-200">
                  {user.role === 'director' ? 'Директор' : 
                   user.role === 'manager' ? 'Менеджер' :
                   user.role === 'engineer' ? 'Инженер' :
                   user.role === 'installer' ? 'Монтажник' :
                   'Подрядчик'}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="ml-auto flex items-center justify-center h-10 w-10 rounded-full hover:bg-indigo-600 transition-colors"
                title="Выйти"
              >
                <LogOut className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className={`fixed inset-0 z-40 flex ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className={`relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4 transform transition-transform duration-300 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-white">АСУ ЛС</h1>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => renderNavItem(item))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}