export type User = {
  id: string;
  email: string;
  avatar: string | null;
};

export type Course = {
  id: string;
  title: string;
  course_overview: string;
};

export type ActingGoals = {
  acting_goals: string;
};

export type TStudentData = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  experience_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'PENDING' | 'RESTRICTED' | 'ACTIVE';
  created_at: string;
  updated_at: string;
  user: User;
  IsPaymentCompleted: boolean;
  course: Course;
  actingGoals: ActingGoals | null;
  avatar: string | null;
  joined_at: string;
  payment_status: 'PENDING' | 'COMPLETED';
  payment_type: 'ONE_TIME' | null;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TStudentManagementResponse = {
  success: boolean;
  data: TStudentData[];
  pagination: Pagination;
};