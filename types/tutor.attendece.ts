export type AttendanceRecord = {
  studentId: string;
  studentName: string;
  studentCode: string;
  email: string;
  avatar: string | null;
  date: string | null;
  status: 'PRESENT' | 'ABSENT' | string;
  attendanceBy: 'QR' | 'MANUAL' | '-' | string;
  classId: string;
  classTitle: string | null;
  classTime: string | null;
  courseId: string;
  courseTitle: string | null;
  presentClasses: number;
  missedClasses: number;
  totalClasses: number;
};

export type AttendanceCard = {
  attendanceRate: number;
  missedClasses: number;
  totalClasses: number;
  presentClasses: number;
  others: number;
};

export type AttendancePagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TAttendanceResponse = {
  success: boolean;
  message: string;
  data: AttendanceRecord[];
  card: AttendanceCard;
  pagination: AttendancePagination;
};