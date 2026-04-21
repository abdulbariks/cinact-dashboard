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
    return await Fetch.get(`/dashboard`, withAuthConfig({ token, context }));
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

  

};
