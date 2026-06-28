import { CookieHelper } from "../../helper/cookie.helper";
import { Fetch } from "../../lib/Fetch";

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
  getConversations: async ({
    token = "",
    context = null,
    search = "",
    type = "",
    limit = 10,
    cursor = "",
    userId = "",
  }: {
    token?: string;
    context?: any;
    search?: string;
    type?: "DM" | "GROUP" | string;
    limit?: number;
    cursor?: string;
    userId?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();

    if (type) searchParams.set("type", type);
    searchParams.set("limit", String(limit));
    if (cursor) searchParams.set("cursor", cursor);
    searchParams.set("search", search);
    if (userId) searchParams.set("userId", userId);

    return await Fetch.get(
      `/conversations?${searchParams.toString()}`,
      withAuthConfig({ token, context }),
    );
  },
  // get Conversation By Id
  getConversationById: async ({
    id = "",
    token = "",
    cursor = "",
    limit = 20,
    context = null,
  }: {
    id?: string;
    token?: string;
    cursor?: string;
    limit?: number;
    context?: any;
  } = {}) => {
    const queryString = buildQueryString({ limit, cursor });

    return await Fetch.get(
      `/conversations/${id}/messages${queryString}`,
      withAuthConfig({ token, context }),
    );
  },
  getSingleConversation: async ({
    conversationId = "",
    token = "",
    context = null,
  }: {
    conversationId?: string;
    token?: string;
    context?: any;
  } = {}) => {
    return await Fetch.get(
      `/conversations/${conversationId}`,
      withAuthConfig({ token, context }),
    );
  },

  //  create DM
  createDM: async ({
    data,
    token = "",
    context = null,
  }: { data?: any; token?: string; context?: any } = {}) => {
    return await Fetch.post(
      `/conversations`,
      data,
      withAuthConfig({ token, context }),
    );
  },
  // create Group
  // createGroup: async ({ data, token = "", context = null }: { data?: any; token?: string; context?: any } = {}) => {
  //   return await Fetch.post(
  //     `/conversations/group`,
  //     data,
  //     withAuthConfig({ token, context })
  //   );
  // },
  // send Message
  sendMessage: async ({ conversationId, data, token = "" }) => {
    return await Fetch.post(
      `/conversations/${conversationId}/messages`,
      data,
      withAuthConfig({ token }),
    );
  },
  // upload Message
  uploadMessage: async ({ conversationId, formData, token = "" }) => {
    return await Fetch.post(
      `/conversations/${conversationId}/messages`,
      formData,
      withMultipartAuthConfig({ token }),
    );
  },
  // mark Conversation Read
  markConversationRead: async ({ conversationId, data, token = "" }) => {
    return await Fetch.patch(
      `/conversations/${conversationId}/read`,
      data,
      withAuthConfig({ token }),
    );
  },
  // delete Conversation
  deleteConversation: async ({ conversationId, token = "" }) => {
    return await Fetch.delete(
      `/conversations/${conversationId}`,
      withAuthConfig({ token }),
    );
  },
  // get Conversation Members
  getConversationMembers: async ({
    conversationId,
    token = "",
    role = "",
  }: {
    conversationId: string;
    token?: string;
    role?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (role) searchParams.set("role", role);

    return await Fetch.get(
      `/conversations/${conversationId}/members${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
      withAuthConfig({ token }),
    );
  },
  // start Call
  startCall: async ({ conversationId, data, token = "" }) => {
    // rtc/conversations/:conversation_id/start
    return await Fetch.post(
      `/rtc/conversations/${conversationId}/start`,
      data,
      withAuthConfig({ token }),
    );
  },

  // join Call
  joinCall: async ({ conversationId, token = "" }) => {
    // rtc/conversations/:conversation_id/join
    return await Fetch.post(
      `/rtc/conversations/${conversationId}/join`,
      {},
      withAuthConfig({ token }),
    );
  },

  // get Call token (refresh)
  getCallToken: async ({ conversationId, token = "" }) => {
    // rtc/conversations/:conversation_id/token
    return await Fetch.post(
      `/rtc/conversations/${conversationId}/token`,
      {},
      withAuthConfig({ token }),
    );
  },

  // decline Call
  declineCall: async ({ conversationId, token = "" }) => {
    // rtc/conversations/:conversation_id/decline
    return await Fetch.post(
      `/rtc/conversations/${conversationId}/decline`,
      {},
      withAuthConfig({ token }),
    );
  },

  // leave Call
  leaveCall: async ({ conversationId, token = "" }) => {
    // rtc/conversations/:conversation_id/leave
    return await Fetch.post(
      `/rtc/conversations/${conversationId}/leave`,
      {},
      withAuthConfig({ token }),
    );
  },

  // end Call
  endCall: async ({ conversationId, token = "" }) => {
    // rtc/conversations/:conversation_id/end
    return await Fetch.post(
      `/rtc/conversations/${conversationId}/end`,
      {},
      withAuthConfig({ token }),
    );
  },

  // update media state (camera/mic/screen share)
  updateMediaState: async ({ conversationId, data, token = "" }) => {
    // rtc/conversations/:conversation_id/participants/me
    return await Fetch.patch(
      `/rtc/conversations/${conversationId}/participants/me`,
      data,
      withAuthConfig({ token }),
    );
  },

  // get call state
  getCallState: async ({ conversationId, token = "" }) => {
    // rtc/conversations/:conversation_id/state
    return await Fetch.get(
      `/rtc/conversations/${conversationId}/state`,
      withAuthConfig({ token }),
    );
  },
};
