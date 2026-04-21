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



// New Types for Modules 
export type TClass = {
  id: string;
  class_title: string;
  class_name: string;
  class_overview:string;
  duration:string 
  status:string;
  createdAt: string;
  instructor:TInstructor
  enrollmentCount: string | number;
};

export type TModule = {
  id: string;
  module_title: string;
  module_name: string;
  module_overview: string;
  courseId: string;
  createdAt: string;
  classes: TClass[];
};


export type TGetCourseModulesResponse = {
  message: string;
  success: boolean;
  data: TModule[];
};

export type TGetClassResponse ={
   message: string;
  success: boolean;
  data:TClass
}



export type TAssignment={
  id:string
  title:string
  description:string
  submissions:string | number
  grades: string | number
  due_date: string
}

export type TGetAssignmentsResponse ={
  message: string;
  success: boolean;
  data: TAssignment[];
}