import { OverviewIcon } from '@/components/icons/SidebarIcons';
import { Layout, Settings, HelpCircle, Users, BookOpen, CreditCard, Home, FileText, Calendar, DollarSign, BarChart } from 'lucide-react';
import { ComponentType } from 'react';

// Define the Menu Item interface
export interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon: ComponentType<{ className?: string,isActive?:boolean }>;
  description: string;
  category: string; // Add category field (required)
}

// Define the Role type
export type UserRole = 'admin' | 'tutor' | 'finance' | 'viewer';

// Menu items configuration for different roles with categories
export const menuConfig: Record<UserRole, MenuItem[]> = {
  admin: [
    // Dashboard Category
    {
      id: 'overview',
      name: 'Overview',
      href: '/dashboard',
      icon: OverviewIcon,
      description: 'Overview and statistics',
      category: 'Dashboard'
    },
    
    // Academic Category
    {
      id: 'courses',
      name: 'Courses',
      href: '/dashboard/courses',
      icon: BookOpen,
      description: 'Manage courses',
      category: 'Academic'
    },
    {
      id: 'students',
      name: 'Students',
      href: '/dashboard/students',
      icon: Users,
      description: 'Manage students',
      category: 'Academic'
    },
    {
      id: 'classes',
      name: 'Classes',
      href: '/dashboard/classes',
      icon: Calendar,
      description: 'Manage classes',
      category: 'Academic'
    },
    
    // Settings Category
    {
      id: 'settings',
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'System settings',
      category: 'Settings'
    },
    {
      id: 'support',
      name: 'Support',
      href: '/dashboard/support',
      icon: HelpCircle,
      description: 'Get help',
      category: 'Settings'
    },
  ],

  tutor: [
    // Dashboard Category
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: Layout,
      description: 'Your teaching overview',
      category: 'Dashboard'
    },
    
    // Teaching Category
    {
      id: 'my-courses',
      name: 'My Courses',
      href: '/dashboard/my-courses',
      icon: BookOpen,
      description: 'Your courses',
      category: 'Teaching'
    },
    {
      id: 'my-students',
      name: 'My Students',
      href: '/dashboard/my-students',
      icon: Users,
      description: 'Your students',
      category: 'Teaching'
    },
    {
      id: 'assignments',
      name: 'Assignments',
      href: '/dashboard/assignments',
      icon: FileText,
      description: 'Grade assignments',
      category: 'Teaching'
    },
    
    // Schedule Category
    {
      id: 'schedule',
      name: 'Schedule',
      href: '/dashboard/schedule',
      icon: Calendar,
      description: 'Your class schedule',
      category: 'Schedule'
    },
  ],

  finance: [
    // Dashboard Category
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: Layout,
      description: 'Financial overview',
      category: 'Dashboard'
    },
    
    // Financial Category
    {
      id: 'invoices',
      name: 'Invoices',
      href: '/dashboard/invoices',
      icon: FileText,
      description: 'Manage invoices',
      category: 'Financial'
    },
    {
      id: 'payments',
      name: 'Payments',
      href: '/dashboard/payments',
      icon: DollarSign,
      description: 'Track payments',
      category: 'Financial'
    },
    {
      id: 'reports',
      name: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart,
      description: 'Financial reports',
      category: 'Financial'
    },
    
    // Settings Category
    {
      id: 'budget',
      name: 'Budget',
      href: '/dashboard/budget',
      icon: CreditCard,
      description: 'Budget planning',
      category: 'Settings'
    },
  ],

  // Default viewer role
  viewer: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: Layout,
      description: 'View dashboard',
      category: 'Dashboard'
    },
    {
      id: 'profile',
      name: 'Profile',
      href: '/profile',
      icon: Users,
      description: 'Your profile',
      category: 'Account'
    }
  ]
};

// Helper function to get menu items by role
export const getMenuItemsByRole = (role: UserRole | string): MenuItem[] => {
  return menuConfig[role as UserRole] || menuConfig.viewer;
};

// Get all available roles
export const getAvailableRoles = (): UserRole[] => {
  return Object.keys(menuConfig) as UserRole[];
};

// Get unique categories for a role
export const getCategoriesByRole = (role: UserRole | string): string[] => {
  const items = getMenuItemsByRole(role);
  const categories = new Set(items.map(item => item.category));
  return Array.from(categories);
};

// Get menu items grouped by category
export const getMenuItemsGroupedByCategory = (role: UserRole | string): Record<string, MenuItem[]> => {
  const items = getMenuItemsByRole(role);
  const grouped: Record<string, MenuItem[]> = {};
  
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  
  return grouped;
};

// Type guard to check if a role is valid
export const isValidRole = (role: string): role is UserRole => {
  return ['admin', 'tutor', 'finance', 'viewer'].includes(role);
};