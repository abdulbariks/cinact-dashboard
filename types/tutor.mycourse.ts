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
  status: "DRAFT" | "UPCOMING" | "ACTIVE" | "INACTIVE" | "COMPLETED";
  seat_capacity: string | number;
  fee: string | number;
  fee_pence?: number;
  duration: string | number;
  createdBy: string;
  instructor: TInstructor | null;
  total_modules: number;
  total_enrollments: number;
  course_overview:string;
};

export type TGetCoursesResponse = {
  message: string;
  success: boolean;
  data: TCourse[];
  meta_data?: {
    page: number;
    limit: number;
    total: number;
    status?: string;
  };
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
  class_overview: string | null;
  duration: string | number;
  start_at?: string | null;
  end_at?: string | null;
  module_id?: string;
  status:string;
  createdAt: string;
  instructor:TInstructor | null;
  enrollmentCount: string | number;
  total_enrollments?: string | number;
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
  due_date?: string
  due_days?: string | number
  average_score?:string | number
  total_marks?: string | number
  submission_Date?: string
  submission_date?: string
  instructor?:TInstructor
}

export type TGetAssignmentsResponse ={
  message: string;
  success: boolean;
  data: TAssignment[];
}

export type TGetAssignmentDetailsByIdResponse={
  message: string;
  success: boolean;
  data: TAssignment
}

export type TStudent ={
  id:string
  name:string
  avatar:string
}

export type TSubmittedAssignment ={
  id:string
  title:string
  description:string
  submitted_at:string
  file_url:string
  assignment_id:string
  student:TStudent
  grade:{
    status:string
    grade:string
    score:string | number
    grade_number:string | number
    feedback:string
  }
}

export type TGetAllSubmittedAssignmentsResponse={
  message: string;
  success: boolean;
  data: TSubmittedAssignment[]
}


export type TVideos={
  id:string;
  asset_url?:string
  file_path?:string
  file_name:string
  type?: string
  mime_type?: string
}
export type TFiles={
  id:string;
  asset_url?:string
  file_path?:string
  file_name:string
  type?: string
  mime_type?: string
}

export type TGetAssetsResponse={
  message: string;
  success: boolean;
  data:{
   videos:TVideos[]
   files:TFiles[]
  }
}


export type TEnrolledUser = {
  id: string;
  name: string;
  username: string | null;
  student_id: string;
  avatar_url: string | null;
  attendance_percentage: number;
  assignments_completed: number;
  total_assignments: number;
};

export type TGetEnrolledUsersResponse = {
  message: string;
  success: boolean;
  data: TEnrolledUser[];
  meta_data: {
    page: number;
    limit: number;
    total: number;
    search: string;
  };
};

//  Define the interface for the class payload
export interface CreateTutorClassPayload {
  class_title: string;
  class_name: string;
  class_overview: string;
  duration: string | number;
  start_date?: string;
  class_date?: string;
  class_time: string;
}
