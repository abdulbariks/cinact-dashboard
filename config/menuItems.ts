import { AttendenceIcon, CalenderIcon, ChatIcon, CommunityIcon, GradHat,   OverviewIcon, PaymentIcon, SettingsIcon, TeacherIcon, UsersIcon } from '@/components/icons/sidebar.tsx/SidebarIcons';
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
      id: 'student-management',
      name: 'Student Management',
      href: '/dashboard/student-management',
      icon: UsersIcon,
      description: 'Manage students',
      category: 'Academic'
    },
    {
      id: 'course-management',
      name: 'Course Management',
      href: '/dashboard/course-management',
      icon:  GradHat,
      description: 'Manage courses',
      category: 'Academic'
    },
    {
      id: 'teacher-management',
      name: 'Teacher Management',
      href: '/dashboard/teacher-management',
      icon: TeacherIcon,
      description: 'Manage teachers',
      category: 'Academic'
    },
    {
      id: 'attendence',
      name: 'Attendence',
      href: '/dashboard/attendence',
      icon: AttendenceIcon,
      description: 'attendence',
      category: 'Academic'
    },
    
    // administration Category
    {
      id: 'finance',
      name: 'Finance & Payments',
      href: '/dashboard/finance-payments',
      icon: PaymentIcon,
      description: 'finance and payments',
      category: 'Administration'
    },
    {
      id: 'events',
      name: 'Events',
      href: '/dashboard/events',
      icon: CalenderIcon,
      description: 'events',
      category: 'Administration'
    },

    // engagement Category

        {
      id: 'chats',
      name: 'Chats',
      href: '/dashboard/chats',
      icon: ChatIcon,
      description: 'chats',
      category: 'Engagement'
    },
    {
      id: 'community',
      name: 'Community',
      href: '/dashboard/community',
      icon: CommunityIcon,
      description: 'community',
      category: 'Engagement'
    },

    // settings category

       {
      id: 'settings',
      name: 'System Settings',
      href: '/dashboard/settings',
      icon: SettingsIcon,
      description: 'settings',
      category: 'Settings'
    }, 




  ],

  tutor: [
    // Dashboard Category
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/tutor-dashboard',
      icon: Layout,
      description: 'Your teaching overview',
      category: 'Dashboard'
    },
    
    // Academic Category
    {
      id: 'my-courses',
      name: 'My Courses',
      href: '/tutor-dashboard/my-courses',
      icon: BookOpen,
      description: 'Your courses',
      category: 'Academic'
    },
    {
      id: 'attendence',
      name: 'Attendence',
      href: '/tutor-dashboard/attendence',
      icon: Users,
      description: 'Your students',
      category: 'Academic'
    },
    // engagement Category
        {
      id: 'chats',
      name: 'Chats',
      href: '/tutor-dashboard/chats',
      icon: ChatIcon,
      description: 'chats',
      category: 'Engagement'
    },

    // settings category
       {
      id: 'settings',
      name: 'System Settings',
      href: '/tutor-dashboard/settings',
      icon: SettingsIcon,
      description: 'settings',
      category: 'Settings'
    }, 
    
  ],

  finance: [
    // Dashboard Category
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/finance-dashboard',
      icon: Layout,
      description: 'Financial overview',
      category: 'Dashboard'
    },
    
    // Academic Category
   {
      id: 'student-management',
      name: 'Student Management',
      href: '/finance-dashboard/student-management',
      icon: UsersIcon,
      description: 'Manage students',
      category: 'Academic'
    },
    // administration Category
    {
      id: 'finance',
      name: 'Finance & Payments',
      href: '/finance-dashboard/finance-payments',
      icon: PaymentIcon,
      description: 'finance and payments',
      category: 'Administration'
    },
  
    // Settings Category
    // {
    //   id: 'budget',
    //   name: 'Budget',
    //   href: '/dashboard/budget',
    //   icon: CreditCard,
    //   description: 'Budget planning',
    //   category: 'Settings'
    // },
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