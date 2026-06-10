import { CreateTutorClassPayload } from "@/types/tutor.mycourse";
import { CookieHelper } from "../../helper/cookie.helper";
import { Fetch } from "../../lib/Fetch";

const jsonConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

const resolveToken = ({ token = "", context = null }: { token?: string; context?: any } = {}) => {
  return token || CookieHelper.get({ key: "token", context }) || "";
};

const withAuthConfig = ({ token = "", context = null }: { token?: string; context?: any } = {}) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + resolveToken({ token, context }),
  },
});

const withMultipartAuthConfig = ({ token = "", context = null }: { token?: string; context?: any } = {}) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + resolveToken({ token, context }),
    "content-type": "multipart/form-data",
  },
});

const withFormDataAuthConfig = ({ token = "", context = null }: { token?: string; context?: any } = {}) => ({
  headers: {
    Authorization: "Bearer " + resolveToken({ token, context }),
  },
});

const buildQueryString = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

export const TutorService = {
  // Tutor overview
  getTutorDashboardOverview: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/admin/overview`, withAuthConfig({ token, context }));
  },

    // Get all courses for the tutor
  getAllCourses: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/courses`, withAuthConfig({ token, context }));
  },

  // Get single course by id
  getCourseById: async ({
    courseId,
    token = "",
    context = null,
  }: {
    courseId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/courses/${courseId}`,
      withAuthConfig({ token, context }),
    );
  },

    // Get aa course modules
  getAllCourseModules: async ({
    courseId,
    token = "",
    context = null,
  }: {
    courseId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/courses/${courseId}/modules`,
      withAuthConfig({ token, context }),
    );
  },


    // Get single class by id
  getClassById: async ({
    classId,
    token = "",
    context = null,
  }: {
    classId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/courses/classes/${classId}`,
      withAuthConfig({ token, context }),
    );
  },

  // Get All Assignments by Class
  getAllAssignmentsByClass: async ({
    classId,
    token = "",
    context = null,
  }: {
    classId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/courses/classes/${classId}/assignments`,
      withAuthConfig({ token, context }),
    );
  },
  // Get All Assets By Class
  getAllAssetsByClass: async ({
    classId,
    token = "",
    context = null,
  }: {
    classId: string;
    token?: string;
    context?: any;
  }) => {
    // /courses/classes/:classId/media
    return await Fetch.get(
      `/courses/classes/${classId}/media`,
      withAuthConfig({ token, context }),
    );
  },

    // Get Assignment Details By Id
  getAssignmentDetailsById: async ({
    assignmentId,
    token = "",
    context = null,
  }: {
    assignmentId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/courses/assignments/${assignmentId}`,
      withAuthConfig({ token, context }),
    );
  },

// get All Submitted Assignments
  getAllSubmittedAssignments:async({
    assignmentId,
    token = "",
    context = null,
  }: {
    assignmentId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      // courses/assignments/:assignmentId/submissions
      `/courses/assignments/${assignmentId}/submissions`,
      withAuthConfig({ token, context }),
    );
  },



  // Create Tutor Class method
createTutorClass: async ({
  moduleId,
  payload,
  token = "",
  context = null,
}: {
  moduleId: string;
  payload: CreateTutorClassPayload;
  token?: string;
  context?: any;
}) => {
  return await Fetch.post(
    `/courses/modules/${moduleId}/classes`,
    payload,
    withAuthConfig({ token, context }),
  );
},

// Create Class Assignment method
createClassAssignment: async ({
  classId,
  payload,
  token = "",
  context = null,
}: {
  classId: string;
  payload: FormData;
  token?: string;
  context?: any;
}) => {
  // courses/classes/:classId/assignments
  return await Fetch.post(
    `/courses/classes/${classId}/assignments`,
    payload,
    withAuthConfig({ token, context }),
  );
},
// Upload Assets in Class
uploadAssents: async ({
  classId,
  payload,
  token = "",
  context = null,
}: {
  classId: string;
  payload: FormData;
  token?: string;
  context?: any;
}) => {
  const config = withAuthConfig({ token, context });

  //Remove the default JSON header
  if (config.headers && config.headers['Content-Type']) {
    delete config.headers['Content-Type'];
  }

  //Perform the request
  return await Fetch.post(
    `/courses/classes/${classId}/media`,
    payload,
    config
  );
},

    updateRemarkAssignment :async({
      submissionId,
      payload,
      token = "",
      context = null,}:{
      submissionId: string;
      payload: any; 
      token?: string;
      context?: any;
    })=>{
        return await Fetch.patch(
          // /courses/submissions/:submissionId/grade
          `/courses/submissions/${submissionId}/grade`,
          payload,
          withAuthConfig({ token, context }),
        );
    },

    // Create Class by Tutor
    createManualEnrollment: async ({
      token = "",
      context = null,
      class_title,
      class_name,
      email,
      phone,
      // address,
      // date_of_birth,
      // experience_level,
      // acting_goals,
      // transaction_id,
      // currncy,
      // amount,
      // payment_date,
      // rules_signing,
      // contract_signing,
    }: {
      token?: string;
      context?: any;
      class_title: string;
      class_name: string;
      email: string;
      phone: string;
      // address: string;
      // date_of_birth: string;
      // experience_level: string;
      // acting_goals: string;
      // transaction_id: string;
      // currncy: string;
      // amount: string;
      // payment_date: string;
      // rules_signing: File;
      // contract_signing: File;
    }) => {
      const formData = new FormData();
  
      formData.append("class_title", class_title);
      formData.append("class_name", class_name);
      formData.append("class_overview", email);
      formData.append("duration", phone);
      // formData.append("start_dat", address);
      // formData.append("date_of_birth", date_of_birth);
      // formData.append("experience_level", experience_level);
      // formData.append("acting_goals", acting_goals);
      // formData.append("transaction_id", transaction_id);
      // formData.append("currncy", currncy);
      // formData.append("amount", amount);
      // formData.append("payment_date", payment_date);
      // formData.append("rules_signing", rules_signing);
      // formData.append("contract_signing", contract_signing);
  
      return await Fetch.post(
        "/admin/student-management/manual-enrollment",
        formData,
        withFormDataAuthConfig({ token, context })
      );
    },
};


export const TutorAttendanceService = {
  getAttendance: async ({
  classId,
  page = 1,
  limit = 10,
  status,
  search,
  token = "",
  context = null,
}: {
  classId: string;
  page?: number;
  limit?: number;
  status?: string; 
  search?: string;
  token?: string;
  context?: any;
}) => {
  const params = new URLSearchParams({
    classId,
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  return await Fetch.get(
    `/admin/courses/attendance?${params.toString()}`,
    withAuthConfig({ token, context })
  );
},
  // Manual Attendance
  manualAttendance: async ({
    classId,
    studentId,
    status,
    token = "",
    context = null,
  }: {
    classId: string;
    studentId: string;
    status: "PRESENT" | "ABSENT";
    token?: string;
    context?: any;
  }) => {
    return await Fetch.post(
      `/admin/courses/attendance/manual`,
      {
        class_id: classId,
        student_id: studentId,
        status,
        attended_at: new Date().toISOString(), // Current timestamp in ISO format
      },
      withAuthConfig({ token, context })
    );
  },
}



export const TutorSystemSettingService = {
  // Tutor Personal Info
  getPersonalInfo: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/profile/personal-info`, withAuthConfig({ token, context }));
  },

  // auth/change-password
  changePassword: async ({
  payload,
  token = "",
  context = null,
}: {
  payload: any;
  token?: string;
  context?: any;
}) => {
  return await Fetch.post(
    `/auth/change-password`,
    payload,
    withAuthConfig({ token, context }),
  );
},

}