export type TInstructor = {
  name: string;
  email: string;
  phone_number: string;
};

export type TCourse = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  class_time: string;
  status: "ACTIVE" | "INACTIVE";
  seat_capacity: string;
  fee: string;
  duration: string;
  createdBy: string;
  instructor: TInstructor;
  total_modules: number;
  total_enrollments: number;
  course_overview:string;
};

export type TGetCoursesResponse = {
  message: string;
  success: boolean;
  data: TCourse[];
};


export type TGetCourseByIdResponse = {
  message: string;
  success: boolean;
  data: TCourse;
};