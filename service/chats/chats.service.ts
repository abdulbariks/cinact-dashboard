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

// const withMultipartAuthConfig = ({ token = "", context = null }: { token?: string; context?: any } = {}) => ({
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + resolveToken({ token, context }),
//     "content-type": "multipart/form-data",
//   },
// });

const withMultipartAuthConfig = ({ token = "", context = null } = {}) => ({
  headers: {
    Authorization: "Bearer " + resolveToken({ token, context }),
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

export const ChatsService = {
   
  // All Users
  getMe: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(`/auth/me`, withAuthConfig({ token, context }));
  },
  // All Users
  getAllUsers: async ({
    token = "",
    context = null,
    search = "",
    type = "",
    limit = 10,
    cursor = "",
  }: {
    token?: string;
    context?: any;
    search?: string;
    type?: string;
    limit?: number;
    cursor?: string;
  } = {}) => {
    const queryString = buildQueryString({ search, type, limit, cursor });

    return await Fetch.get(
      `/users/discover${queryString}`,
      withAuthConfig({ token, context }),
    );
  },
  // Get Conversations
  getConversations: async ({ token = "", context = null } = {}) => {
    return await Fetch.get(
      `/conversations`, 
      withAuthConfig({ token, context })
    );
  },
  // get Conversation By Id
  // getConversationById: async ({ id ="", token = "", context = null } = {}) => {
  //   return await Fetch.get(
  //     `/conversations/${id}/messages`, 
  //     withAuthConfig({ token, context })
  //   );
  // },
  // get Conversation By Id with Cursor Pagination
  getConversationById: async ({ 
    id = "", 
    token = "", 
    cursor = null, 
    take = 500, 
    context = null 
  } = {}) => {
    // Build query parameters
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (take) params.append("limit", take.toString());

    const queryString = params.toString();
    const url = `/conversations/${id}/messages${queryString ? `?${queryString}` : ""}`;

    return await Fetch.get(
      url, 
      withAuthConfig({ token, context })
    );
  },
  //  create DM
  createDM: async ({ data, token = "", context = null }: { data?: any; token?: string; context?: any } = {}) => {
    return await Fetch.post(
      `/conversations`, 
      data, 
      withAuthConfig({ token, context })
    );
  },
  // create Group
  createGroup: async ({ data, token = "", context = null }: { data?: any; token?: string; context?: any } = {}) => {
    return await Fetch.post(
      `/conversations/group`, 
      data,
      withAuthConfig({ token, context })
    );
  },
  // send Message
sendMessage: async ({ conversationId, data, token = "" }) => {
  return await Fetch.post(
    `/conversations/${conversationId}/messages`,
    data,
    withAuthConfig({ token })
  );
},
// upload Message
uploadMessage: async ({ conversationId, formData, token = "" }) => {
  return await Fetch.post(
    `/conversations/${conversationId}/messages/upload`,
    formData,
    withMultipartAuthConfig({ token })
  );
},
};
