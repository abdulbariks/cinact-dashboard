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

export const FinanceService = {
  // super admin overview
  getFinanceDashboardOverview: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/dashboard`, withAuthConfig({ token, context }));
  },

  // get all courses
  getAllCourses: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/course/all`, withAuthConfig({ token, context }));
  },

  // get all instructors
  getAllInstructors: async ({
    token = "",
    context = null,
    page = 1,
    limit = 10,
  }: {
    token?: string;
    context?: any;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryString = buildQueryString({ page, limit });

    return await Fetch.get(`/instructors${queryString}`, withAuthConfig({ token, context }));
  },

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
      withFormDataAuthConfig({ token, context })
    );
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
    return await Fetch.get(`/user/profile/${username}`, withAuthConfig({ token, context }));
  },
};
