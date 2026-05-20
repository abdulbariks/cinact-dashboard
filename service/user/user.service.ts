import { CookieHelper } from "../../helper/cookie.helper";
import { Fetch } from "../../lib/Fetch";
import { CreateTutorClassPayload } from "@/types/tutor.mycourse";

const jsonConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

const resolveToken = ({
  token = "",
  context = null,
}: { token?: string; context?: any } = {}) => {
  return token || CookieHelper.get({ key: "token", context }) || "";
};

const withAuthConfig = ({
  token = "",
  context = null,
}: { token?: string; context?: any } = {}) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + resolveToken({ token, context }),
  },
});

const withMultipartAuthConfig = ({
  token = "",
  context = null,
}: { token?: string; context?: any } = {}) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + resolveToken({ token, context }),
    "content-type": "multipart/form-data",
  },
});

const withFormDataAuthConfig = ({
  token = "",
  context = null,
}: { token?: string; context?: any } = {}) => ({
  headers: {
    Authorization: "Bearer " + resolveToken({ token, context }),
  },
});

const buildQueryString = (
  params: Record<string, string | number | undefined>,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

export const UserService = {
  // login
  login: async ({ email, password }: { email: string; password: string }) => {
    const data = {
      email: email,
      password: password,
    };
    return await Fetch.post("/auth/login/", data, jsonConfig);
  },

  // super admin overview
  getDashboardOverview: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/dashboard`, withAuthConfig({ token, context }));
  },

  // get all courses
  getAllCourses: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/course/all`, withAuthConfig({ token, context }));
  },

  // get all students

  getAllStudentManagement: async ({
    token = "",
    context = null,
    search = "",
    status = "",
    paymentStatus = "",
    page = 1,
    limit = 10,
  }: {
    token?: string;
    context?: any;
    search?: string;
    status?: string;
    paymentStatus?: string | boolean;
    page?: number;
    limit?: number;
  } = {}) => {
    return await Fetch.get(`/admin/student-management`, {
      ...withAuthConfig({ token, context }),
      params: {
        search,
        status,
        paymentStatus,
        page,
        limit,
      },
    });
  },

  // Student Details (admin)
  getStudentDetails: async ({ id, token = "", context = null }: { id: string; token?: string; context?: any }) => {
    return await Fetch.get(
      `/admin/student-management/student/${id}`,
      withAuthConfig({ token, context }),
    );
  },

  // get all instructors
  getAllInstructors: async ({
    token = "",
    context = null,
    search = "",
    status = "",
    type = "",
    page = 1,
    limit = 10,
  }: {
    token?: string;
    context?: any;
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryString = buildQueryString({ status, type, search, page, limit });

    return await Fetch.get(
      `/admin/users${queryString}`,
      withAuthConfig({ token, context }),
    );
  },

  deleteUser: async ({
    userId,
    token = "",
    context = null,
  }: {
    userId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.delete(
      `/admin/users/${userId}`,
      withAuthConfig({ token, context }),
    );
  },

  getInstructorDetailsById: async ({
    instructorId,
    token = "",
    context = null,
  }: {
    instructorId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/admin/users/${instructorId}`,
      withAuthConfig({ token, context }),
    );
  },

  createInstructor: async ({
    payload,
    token = "",
    context = null,
  }: {
    payload: {
      name: string;
      email: string;
      password: string;
      phone: string;
      type: string;
      join_date: string;
      experience: string;
    };
    token?: string;
    context?: any;
  }) => {
    return await Fetch.post(
      `/admin/users`,
      payload,
      withAuthConfig({ token, context }),
    );
  },

  updateInstructor: async ({
    instructorId,
    payload,
    token = "",
    context = null,
  }: {
    instructorId: string;
    payload: {
      name?: string;
      // email?: string;
      phone_number?: string;
      type?: string;
      status?: string;
      join_date?: string;
      experience?: string;
    };
    token?: string;
    context?: any;
  }) => {
    return await Fetch.patch(
      `/admin/users/${instructorId}`,
      payload,
      withAuthConfig({ token, context }),
    );
  },

  // student manual enrollment by super admin
  createManualEnrollment: async ({
    token = "",
    context = null,
    courseId,
    full_name,
    email,
    phone,
    address,
    date_of_birth,
    experience_level,
    acting_goals,
    transaction_id,
    currncy,
    amount,
    payment_date,
    rules_signing,
    contract_signing,
  }: {
    token?: string;
    context?: any;
    courseId: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    date_of_birth: string;
    experience_level: string;
    acting_goals: string;
    transaction_id: string;
    currncy: string;
    amount: string;
    payment_date: string;
    rules_signing: File;
    contract_signing: File;
  }) => {
    const formData = new FormData();

    formData.append("courseId", courseId);
    formData.append("full_name", full_name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("date_of_birth", date_of_birth);
    formData.append("experience_level", experience_level);
    formData.append("acting_goals", acting_goals);
    formData.append("transaction_id", transaction_id);
    formData.append("currncy", currncy);
    formData.append("amount", amount);
    formData.append("payment_date", payment_date);
    formData.append("rules_signing", rules_signing);
    formData.append("contract_signing", contract_signing);

    return await Fetch.post(
      "/admin/student-management/manual-enrollment",
      formData,
      withFormDataAuthConfig({ token, context }),
    );
  },

  // get all posts ====================================================================
  getAllCommunityPosts: async ({
    token = "",
    context = null,
    search = "",
    status = "",
    role = "",
    page = 1,
    limit = 10,
  }: {
    token?: string;
    context?: any;
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const authConfig = withAuthConfig({ token, context });

    return await Fetch.get(`/admin/community-management/posts`, {
      ...authConfig,
      params: { search, status, role, page, limit },
    });
  },

  //  another get all posts for super admin home page ===================================

  register: async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const data = {
      username: username,
      email: email,
      password: password,
    };
    return await Fetch.post("/auth/register", data, jsonConfig);
  },

  logout: (context = null) => {
    CookieHelper.destroy({ key: "token", context });
    CookieHelper.destroy({ key: "accessToken", context });
    CookieHelper.destroy({ key: "refreshToken", context });
    CookieHelper.destroy({ key: "user", context });
    CookieHelper.destroy({ key: "userRole", context });
  },
  // get user details
  getUserDetails: async ({ token = "", context = null }) => {
    return await Fetch.get(`/user/me`, withAuthConfig({ token, context }));
  },

  findAll: async (context = null) => {
    return await Fetch.get(`/user`, withAuthConfig({ context }));
  },

  findOne: async (id: number, context = null) => {
    return await Fetch.get(`/user/${id}`, withAuthConfig({ context }));
  },

  findOneByUsername: async ({
    username,
    token = "",
    context = null,
  }: {
    username: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/user/profile/${username}`,
      withAuthConfig({ token, context }),
    );
  },

  update: async (
    {
      fname,
      lname,
      date_of_birth,
      city,
      country,
      organization,
      recipient_name,
      recipient_zip_code,
      recipient_country,
      recipient_state,
      recipient_city,
      recipient_address,
      recipient_phone_number,
    }: {
      fname: string;
      lname: string;
      date_of_birth: string;
      city: string;
      country: string;
      organization: string;
      recipient_name: string;
      recipient_zip_code: string;
      recipient_country: string;
      recipient_state: string;
      recipient_city: string;
      recipient_address: string;
      recipient_phone_number: string;
    },
    context = null,
  ) => {
    const data = {
      fname: fname,
      lname: lname,
      date_of_birth: date_of_birth,
      city: city,
      country: country,
      organization: organization,
      recipient_name: recipient_name,
      recipient_zip_code: recipient_zip_code,
      recipient_country: recipient_country,
      recipient_state: recipient_state,
      recipient_city: recipient_city,
      recipient_address: recipient_address,
      recipient_phone_number: recipient_phone_number,
    };

    return await Fetch.patch(`/user`, data, withAuthConfig({ context }));
  },

  updateAvatar: async (data: any, context = null) => {
    return await Fetch.patch(
      `/user/avatar`,
      data,
      withMultipartAuthConfig({ context }),
    );
  },

  //
  create: async (
    {
      fname,
      lname,
      username,
      email,
      role_id,
    }: {
      fname: string;
      lname: string;
      username: string;
      email: string;
      role_id: number;
    },
    context: any = null,
  ) => {
    const data = {
      fname: fname,
      lname: lname,
      username: username,
      email: email,
      role_id: role_id,
    };

    return await Fetch.post(`/user`, data, withAuthConfig({ context }));
  },

  // TODO
  confirm: async (
    {
      id,
      token,
      email,
      password,
    }: { id: number; token: string; email: string; password: string },
    context: any = null,
  ) => {
    const data = {
      id: id,
      token: token,
      email: email,
      password: password,
    };

    return await Fetch.patch(
      `/user/${id}/password`,
      data,
      withAuthConfig({ context }),
    );
  },
};

export const AdminAttendanceService = {
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
      `/attendance?${params.toString()}`,
      withAuthConfig({ token, context }),
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
      `/attendance/manual`,
      {
        classId,
        studentId,
        status,
        attendedAt: new Date().toISOString(), // Current timestamp
      },
      withAuthConfig({ token, context }),
    );
  },
};

export const AdminCourseManagementService = {
  getAllCourses: async ({
    token = "",
    context = null,
    search = "",
    status = "",
    page,
    limit,
  }: {
    token?: string;
    context?: any;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    return await Fetch.get(`/admin/courses`, {
      ...withAuthConfig({ token, context }),
      params: {
        search,
        status,
        page,
        limit,
      },
    });
  },

  createCourse: async ({
    payload,
    token = "",
    context = null,
  }: {
    payload: any;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.post(
      `/admin/courses`,
      payload,
      withAuthConfig({ token, context }),
    );
  },

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
      `/admin/courses/${courseId}`,
      withAuthConfig({ token, context }),
    );
  },

  updateCourse: async ({
    courseId,
    payload,
    token = "",
    context = null,
  }: {
    courseId: string;
    payload: any;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.patch(
      `/admin/courses/${courseId}`,
      payload,
      withAuthConfig({ token, context }),
    );
  },

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
      `/admin/courses/${courseId}/modules`,
      withAuthConfig({ token, context }),
    );
  },

  createCourseModule: async ({
    courseId,
    payload,
    token = "",
    context = null,
  }: {
    courseId: string;
    payload: any;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.post(
      `/admin/courses/${courseId}/modules`,
      payload,
      withAuthConfig({ token, context }),
    );
  },

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
      `/admin/courses/modules/classes/${classId}`,
      withAuthConfig({ token, context }),
    );
  },

  createClass: async ({
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
      `/admin/courses/modules/${moduleId}/classes`,
      payload,
      withAuthConfig({ token, context }),
    );
  },

  updateClass: async ({
    classId,
    payload,
    token = "",
    context = null,
  }: {
    classId: string;
    payload: any;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.patch(
      `/admin/courses/modules/classes/${classId}`,
      payload,
      withAuthConfig({ token, context }),
    );
  },

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
      `/admin/courses/modules/classes/${classId}/assignments`,
      withAuthConfig({ token, context }),
    );
  },

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
    const config = withAuthConfig({ token, context });
    delete config.headers["Content-Type"];

    return await Fetch.post(
      `/courses/classes/${classId}/assignments`,
      payload,
      config,
    );
  },

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

  getAllSubmittedAssignments: async ({
    assignmentId,
    token = "",
    context = null,
  }: {
    assignmentId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/courses/assignments/${assignmentId}/submissions`,
      withAuthConfig({ token, context }),
    );
  },

  getAllAssetsByClass: async ({
    classId,
    token = "",
    context = null,
  }: {
    classId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.get(
      `/admin/courses/modules/classes/${classId}/assets`,
      withAuthConfig({ token, context }),
    );
  },

  uploadAssets: async ({
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
    delete config.headers["Content-Type"];

    return await Fetch.post(
      `/courses/classes/${classId}/media`,
      payload,
      config,
    );
  },

  deleteAssets: async ({
    assetId,
    token = "",
    context = null,
  }: {
    assetId: string;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.delete(
      `/admin/courses/modules/classes/assets/${assetId}`,
      withAuthConfig({ token, context }),
    );
  },
};

export const AdminPaymentsTransactionsService = {
  // get Finance Payments Stats
  getPaymentsStats: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(
      `/finance/revenue/stats`,
      withAuthConfig({ token, context }),
    );
  },

  // get Finance Payments Transactions
  getAllPaymentsTransactions: async ({
    token = "",
    context = null,
    search = "",
    // date = "",
    paymentPlan = "",
    page = 1,
    limit = 10,
  }: {
    token?: string;
    context?: any;
    search?: string;
    // date?:string;
    paymentPlan?: string | boolean;
    page?: number;
    limit?: number;
  } = {}) => {
    return await Fetch.get(`/finance/transactions`, {
      ...withAuthConfig({ token, context }),
      params: {
        search,
        // date,
        paymentPlan,
        page,
        limit,
      },
    });
  },
};

export const AdminEventService = {
  getEvent: async ({
    token = "",
    context = null,
    search = "",
    status = "",
    page = 1,
    limit = 10,
  }: {
    token?: string;
    context?: any;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    return await Fetch.get(`/admin/events`, {
      ...withAuthConfig({ token, context }),
      params: {
        search,
        status,
        page,
        limit,
      },
    });
  },
  getEventById: async (id: string, token: string) => {
    return await Fetch.get(`/admin/events/${id}`, withAuthConfig({ token }));
  },
  getEventMembersById: async ({
    id,
    token = "",
    context = null,
    search = "",
    date = "",
    page = 1,
    limit = 10,
  }: {
    id: string;
    token?: string;
    context?: any;
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => {
    return await Fetch.get(`/admin/events/${id}/members`, {
      ...withAuthConfig({ token, context }),
      params: {
        search,
        date,
        page,
        limit,
      },
    });
  },

  createEvent: async (data: any, token: string) => {
    return await Fetch.post(`/admin/events`, data, withAuthConfig({ token }));
  },
  updateEvent: async (id: string, data: any, token: string) => {
    //  /events/:eventId
    return await Fetch.patch(
      `/admin/events/${id}`,
      data,
      withAuthConfig({ token }),
    );
  },
};

export const AdminCommunityService = {
  getAllPosts: async ({
    token = "",
    context = null,
    status = "",
    role = "",
    page = 1,
    limit = 10,
    search = "",
  }: {
    token?: string;
    context?: any;
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    return await Fetch.get(`/admin/community/posts`, {
      ...withAuthConfig({ token, context }),
      params: {
        status,
        role,
        page,
        limit,
        search,
      },
    });
  },
  getAllRequestedPosts: async ({
    token = "",
    context = null,
    status = "Request",
    role = "",
    page = 1,
    limit = 10,
    search = "",
  }: {
    token?: string;
    context?: any;
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    // admin/community-management/requested-posts
    return await Fetch.get(`/admin/community/posts`, {
      ...withAuthConfig({ token, context }),
      params: {
        status,
        role,
        page,
        limit,
        search,
      },
    });
  },
  getPostDetailsById: async (
    id: string,
    token: string = "",
    context: any = null,
  ) => {
    return await Fetch.get(
      `/admin/community/posts/${id}`,
      {
        ...withAuthConfig({ token, context }),
      },
    );
  },
  statusUpdatePost: async (id: string, token: string, status: string) =>
    await Fetch.patch(
      `/admin/community/post/${id}/status`,
      { status },
      withAuthConfig({ token }),
    ),
  // rejectPost: async (id: string, token: string) =>
  //   await Fetch.patch(
  //     `/admin/community-management/reject-post/${id}`,
  //     {},
  //     withAuthConfig({ token }),
  //   ),
  // flagPost: async (id: string, token: string) =>
  //   await Fetch.patch(
  //     `/admin/community-management/flag-unflag-post/${id}`,
  //     {},
  //     withAuthConfig({ token }),
  //   ),
  deletePost: async (id: string, token: string = "") => {
    // admin/community/post/cmm7df5lm0001kg90ajhm9olt
    return await Fetch.delete(`/admin/community/post/${id}`, {
      ...withAuthConfig({ token }),
    });
  },
};

export const AdminSystemSettingService = {
  getPersonalInfo: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(
      `/profile/personal-info`,
      withAuthConfig({ token, context }),
    );
  },

  updatePersonalInfo: async ({
    data,
    token = "",
    context = null,
  }: {
    data: any;
    token?: string;
    context?: any;
  }) => {
    return await Fetch.put(
      `/profile/personal-info`,
      data,
      withAuthConfig({ token, context }),
    );
  },

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
};
