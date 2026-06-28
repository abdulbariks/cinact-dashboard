"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";
import { ChatsService } from "@/service/chats/chats.service";
import { showErrorToast } from "@/lib/hotToast";
import { cn } from "@/lib/utils";
import { connectSocket } from "@/lib/Socket";

// Icons
import CallIcon from "../icons/chats/CallIcon";
import VideoIcon from "../icons/chats/VideoIcon";
import WarningIcon from "../icons/chats/WarningIcon";
import PlusChatIcon from "../icons/chats/PlusChatIcon";
import ImageIcon from "../icons/chats/ImageIcon";
import MicIcon from "../icons/chats/MicIcon";
import EmojiIcon from "../icons/chats/EmojiIcon";

// Call screen
import CallScreen from "./CallScreen";

type ChatAreaProps = {
  chatId: string;
};

const getMessageConversationId = (message: any) =>
  message?.conversation_id || message?.conversationId;

const getMessageContent = (message: any) => {
  if (typeof message?.content === "string") return message.content;
  return message?.content?.text || "";
};

const getCallContent = (message: any) => {
  if (message?.kind !== "CALL" || typeof message?.content !== "object")
    return null;

  return {
    callKind:
      message.content?.call_kind || message.content?.callKind || "VIDEO",
    status: message.content?.status || "ONGOING",
    durationSeconds:
      message.content?.duration_seconds ??
      message.content?.durationSeconds ??
      null,
  };
};

const getMessageCreatedAt = (message: any) =>
  message?.created_at || message?.createdAt;

const getAttachmentUrl = (attachment: any) =>
  attachment?.url ||
  attachment?.file_path ||
  attachment?.filePath ||
  attachment?.media_url ||
  attachment?.mediaUrl ||
  attachment?.media_Url;

const getMessageImageUrl = (message: any) =>
  getAttachmentUrl(message?.attachments?.[0]) ||
  message?.attachment?.url ||
  message?.file_path ||
  message?.filePath ||
  message?.media_url ||
  message?.mediaUrl ||
  message?.media_Url;

const getMessageImageUrls = (message: any) => {
  const attachmentUrls = Array.isArray(message?.attachments)
    ? message.attachments
        .map((attachment: any) => getAttachmentUrl(attachment))
        .filter(Boolean)
    : [];

  const singleUrl = getMessageImageUrl(message);
  return attachmentUrls.length > 0 || !singleUrl ? attachmentUrls : [singleUrl];
};

const isImageUrl = (url: string) => {
  if (!url) return false;
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".ico",
  ];
  return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  if (["zip", "rar"].includes(ext)) return "📦";
  if (["txt", "json", "js", "xml"].includes(ext)) return "📋";
  if (["mp4", "webm", "ogg"].includes(ext)) return "🎥";
  return "📎";
};

const AudioPlayButton = ({
  src,
  duration,
  className,
}: {
  src: string;
  duration?: number;
  className?: string;
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "none";
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalDuration = typeof duration === "number" ? duration : 0;
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      className={cn(
        "my-1 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2",
        className,
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          togglePlay();
        }}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
          isPlaying
            ? "bg-[#E9201D]/20 text-[#ff706e]"
            : "bg-white/10 text-white",
        )}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <div className="h-1 w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#E9201D] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-[10px] text-gray-300 tabular-nums">
        {formatTime(currentTime)}
      </span>
      {typeof duration === "number" && (
        <span className="text-[10px] text-gray-500 tabular-nums">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
};

const getMessageId = (message: any) =>
  message?.id || message?._id || message?.clientId;

const getMessageSenderId = (message: any) =>
  message?.sender?.id || message?.senderId || message?.sender_id;

const sortMessagesByCreatedAt = (items: any[]) => {
  return [...items].sort((a, b) => {
    const first = new Date(getMessageCreatedAt(a) || 0).getTime();
    const second = new Date(getMessageCreatedAt(b) || 0).getTime();

    return first - second;
  });
};

const formatCallDuration = (seconds: number | null) => {
  const totalSeconds = Number(seconds || 0);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return minutes > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

const getCallMessageLabel = (message: any) => {
  const content = getCallContent(message);
  if (!content) return "";

  const isVideo = content.callKind === "VIDEO";
  const callType = isVideo ? "Video" : "Audio";

  if (content.status === "ONGOING") return `${callType} call is ongoing`;
  if (content.status === "MISSED")
    return `Missed ${callType.toLowerCase()} call`;

  return `${callType} call - ${formatCallDuration(content.durationSeconds)}`;
};

const normalizeMessage = (message: any, fallback: any = {}) => {
  const source = message?.data || message?.message || message;
  const createdAt =
    getMessageCreatedAt(source) ||
    fallback.createdAt ||
    new Date().toISOString();
  const sourceUrl = getMessageImageUrl(source);
  const attachments =
    source?.attachments ||
    (sourceUrl
      ? [
          {
            url: sourceUrl,
          },
        ]
      : fallback.attachments || []);

  return {
    ...fallback,
    ...source,
    id: getMessageId(source) || fallback.id,
    conversationId: getMessageConversationId(source) || fallback.conversationId,
    conversation_id:
      getMessageConversationId(source) || fallback.conversation_id,
    content:
      typeof source?.content === "string"
        ? { text: source.content }
        : source?.content || fallback.content,
    attachments,
    createdAt,
    created_at: createdAt,
  };
};

export default function ChatArea({ chatId }: ChatAreaProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  // console.log("messages", messages);

  const [draftMessage, setDraftMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{
    type: "audio" | "video";
    isIncoming: boolean;
  } | null>(null);
  const [incomingCall, setIncomingCall] = useState<{
    type: "audio" | "video";
    caller: {
      id: string;
      name: string;
      avatar: string | null;
    };
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSendingRef = useRef(false);
  const lastReadMessageIdRef = useRef<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const recordingDurationRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const profile = await ChatsService.getMe({ token });
      setCurrentUserId(profile?.data?.data?.id);

      const [convRes, msgRes] = await Promise.all([
        ChatsService.getSingleConversation({ conversationId: chatId, token }),
        ChatsService.getConversationById({
          id: chatId,
          token,
          limit: 20,
        }),
      ]);

      setConversation(convRes?.data?.data || null);

      const messageData = Array.isArray(msgRes?.data?.data)
        ? msgRes.data.data
        : Array.isArray(msgRes?.data?.items)
          ? msgRes.data.items
          : [];

      setMessages(
        sortMessagesByCreatedAt(
          messageData.map((msg) => normalizeMessage(msg)),
        ),
      );
    } catch (err: any) {
      showErrorToast(err?.message || "Failed to load chat");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [chatId]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  const markLatestIncomingRead = useCallback(
    async (message: any) => {
      const messageId = getMessageId(message);
      if (!currentUserId) return;
      if (!messageId || lastReadMessageIdRef.current === messageId) return;
      if (getMessageConversationId(message) !== chatId) return;
      if (getMessageSenderId(message) === currentUserId || message.is_me)
        return;

      lastReadMessageIdRef.current = messageId;

      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const at = getMessageCreatedAt(message) || new Date().toISOString();

        await ChatsService.markConversationRead({
          conversationId: chatId,
          token,
          data: {
            up_to_message_id: messageId,
          },
        });

        socketRef.current?.emit("message:read", {
          conversation_id: chatId,
          at: new Date(at).toISOString(),
        });
      } catch (error) {
        console.error("Failed to mark conversation read:", error);
        lastReadMessageIdRef.current = null;
      }
    },
    [chatId, currentUserId],
  );

  //  SOCKET (REAL-TIME)
  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token || cookies.accessToken || "";
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    const joinConversation = () => {
      socket.emit("conversation:join", { conversation_id: chatId });
    };

    //  join room ONLY once per chatId and rejoin after reconnect
    joinConversation();
    socket.off("connect", joinConversation);
    socket.on("connect", joinConversation);

    const upsertMessage = (message: any) => {
      const normalizedMessage = normalizeMessage(message);
      if (getMessageConversationId(normalizedMessage) !== chatId) return;

      setMessages((prev) => {
        const incomingId = getMessageId(normalizedMessage);
        const incomingClientId = normalizedMessage.clientId;
        const existingIndex = prev.findIndex((m) => {
          const prevId = getMessageId(m);
          return (
            (incomingId && prevId === incomingId) ||
            (incomingClientId && m.clientId === incomingClientId)
          );
        });

        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = normalizeMessage(
            normalizedMessage,
            next[existingIndex],
          );
          return sortMessagesByCreatedAt(next);
        }

        return sortMessagesByCreatedAt([...prev, normalizedMessage]);
      });

      void markLatestIncomingRead(normalizedMessage);
    };

    const upsertCallMessage = (payload: any) => {
      const conversationId =
        payload?.conversation_id || payload?.conversationId;
      if (conversationId !== chatId) return;

      upsertMessage({
        ...(payload?.message || payload),
        conversation_id: conversationId,
        conversationId,
      });
    };

    // Handle incoming call notification
    const handleCallIncoming = (call: any) => {
      const conversationId = call?.conversation_id || call?.conversationId;
      if (conversationId !== chatId) return;

      // Show incoming call notification
      setIncomingCall({
        type: call.kind === "VIDEO" ? "video" : "audio",
        caller: {
          id: call.caller?.id || "",
          name: call.caller?.name || "Unknown",
          avatar: call.caller?.avatar || null,
        },
      });
      console.log("Incoming call:", call);
    };

    // Handle participant joined
    const handleParticipantJoined = (payload: any) => {
      console.log("Participant joined:", payload);
      // Update UI to show new participant
      // This would be handled by the call screen if it's open
    };

    // Handle participant left
    const handleParticipantLeft = (payload: any) => {
      console.log("Participant left:", payload);
      // Update UI to remove participant
      // This would be handled by the call screen if it's open
    };

    // Handle participant updated (camera/mic changes)
    const handleParticipantUpdated = (payload: any) => {
      console.log("Participant updated:", payload);
      // Update UI to reflect media state changes
      // This would be handled by the call screen if it's open
    };

    // Handle call declined
    const handleCallDeclined = (payload: any) => {
      const conversationId =
        payload?.conversation_id || payload?.conversationId;
      if (conversationId && conversationId !== chatId) return;

      console.log("Call declined:", payload);
      // Show notification that call was declined
      // Clear both active and incoming call states
      setActiveCall(null);
      setIncomingCall(null);
    };

    // Handle call ended
    const handleCallEnded = (payload: any) => {
      const conversationId =
        payload?.conversation_id || payload?.conversationId;
      if (conversationId && conversationId !== chatId) return;

      console.log("Call ended:", payload);
      // End the call and return to chat
      setActiveCall(null);
      setIncomingCall(null);
    };

    socket.off("message:new", upsertMessage);
    socket.on("message:new", upsertMessage);
    socket.off("message:sent", upsertMessage);
    socket.on("message:sent", upsertMessage);
    socket.off("call:message_updated", upsertCallMessage);
    socket.on("call:message_updated", upsertCallMessage);

    // Call events
    socket.off("call:incoming", handleCallIncoming);
    socket.on("call:incoming", handleCallIncoming);
    socket.off("call:participant_joined", handleParticipantJoined);
    socket.on("call:participant_joined", handleParticipantJoined);
    socket.off("call:participant_left", handleParticipantLeft);
    socket.on("call:participant_left", handleParticipantLeft);
    socket.off("call:participant_updated", handleParticipantUpdated);
    socket.on("call:participant_updated", handleParticipantUpdated);
    socket.off("call:declined", handleCallDeclined);
    socket.on("call:declined", handleCallDeclined);
    socket.off("call:ended", handleCallEnded);
    socket.on("call:ended", handleCallEnded);

    return () => {
      socket.off("connect", joinConversation);
      socket.emit("conversation:leave", { conversation_id: chatId });
      socket.off("message:new", upsertMessage);
      socket.off("message:sent", upsertMessage);
      socket.off("call:message_updated", upsertCallMessage);
      socket.off("call:incoming", handleCallIncoming);
      socket.off("call:participant_joined", handleParticipantJoined);
      socket.off("call:participant_left", handleParticipantLeft);
      socket.off("call:participant_updated", handleParticipantUpdated);
      socket.off("call:declined", handleCallDeclined);
      socket.off("call:ended", handleCallEnded);
    };
  }, [chatId, markLatestIncomingRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const uniqueMessages = React.useMemo(() => {
    const seen = new Set<string>();
    return messages.filter((msg) => {
      const id = getMessageId(msg);
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [messages]);

  //  SEND MESSAGE
  const handleSendMessage = async () => {
    if (isSendingRef.current) return;

    const text = draftMessage.trim();
    if (!text && attachments.length === 0 && !voiceBlob) return;

    const cookies = parseCookies();
    const token = cookies.token || cookies.accessToken || "";
    const selectedAttachments = attachments;
    const clientId = `client-${Date.now()}`;

    const hasVoice = !!voiceBlob;
    const durationSeconds = recordingDurationRef.current || recordingTime || 0;
    const voiceFile = hasVoice
      ? new File(
          [voiceBlob],
          `voice-${formatRecordingTime(durationSeconds)}-${Date.now()}.mp3`,
          { type: "audio/mpeg" },
        )
      : null;

    setDraftMessage("");
    setAttachments([]);
    setVoiceBlob(null);
    setRecordingTime(0);
    isSendingRef.current = true;
    setIsSending(true);

    const payload = {
      kind: hasVoice
        ? "AUDIO"
        : selectedAttachments.length > 0
          ? "FILE"
          : "TEXT",
      content: text,
    };

    const optimisticAttachments = hasVoice
      ? [
          {
            url: URL.createObjectURL(voiceBlob),
            name: voiceFile!.name,
            type: voiceFile!.type,
            duration: durationSeconds,
          },
          ...selectedAttachments.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type,
          })),
        ]
      : selectedAttachments.map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
        }));

    const optimisticMessage = normalizeMessage(
      {
        ...payload,
        id: clientId,
        clientId,
        conversationId: chatId,
        senderId: currentUserId,
        is_me: true,
        attachments: optimisticAttachments,
      },
      { createdAt: new Date().toISOString() },
    );

    setMessages((prev) =>
      sortMessagesByCreatedAt([...prev, optimisticMessage]),
    );

    try {
      let response;

      if (hasVoice || selectedAttachments.length > 0) {
        const formData = new FormData();
        formData.append("kind", hasVoice ? "AUDIO" : "FILE");
        if (text) {
          formData.append("content", text);
        }
        if (hasVoice && voiceFile) {
          formData.append("attachments", voiceFile);
        }
        selectedAttachments.forEach((file) => {
          formData.append("attachments", file);
        });

        response = await ChatsService.uploadMessage({
          conversationId: chatId,
          token,
          formData,
        });
      } else {
        response = await ChatsService.sendMessage({
          conversationId: chatId,
          token,
          data: {
            kind: "TEXT",
            content: text,
          },
        });
      }

      const savedMessage = normalizeMessage(
        response?.data?.data || response?.data?.item || response?.data,
        optimisticMessage,
      );

      setMessages((prev) => {
        const next = prev.map((message) =>
          getMessageId(message) === clientId || message.clientId === clientId
            ? savedMessage
            : message,
        );
        return sortMessagesByCreatedAt(next);
      });
    } catch (err) {
      console.error("Send failed", err);
      showErrorToast("Message failed to send");
      setDraftMessage(text);
      setAttachments(selectedAttachments);
      if (hasVoice && voiceFile) {
        setAttachments((prev) => [...prev, voiceFile]);
      }
      setVoiceBlob(null);
      setMessages((prev) =>
        prev.filter((message) => getMessageId(message) !== clientId),
      );
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files) return;

    const files = Array.from(input.files);

    if (!files.length) {
      e.target.value = "";
      return;
    }

    setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (fileToRemove: File) => {
    setAttachments((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.lastModified === fileToRemove.lastModified
          ),
      ),
    );
  };

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType =
        MediaRecorder.isTypeSupported("audio/mpeg") && "audio/mpeg";
      const mediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingDurationRef.current = 0;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mimeType || "audio/webm",
        });
        setVoiceBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setVoiceBlob(null);

      recordingTimerRef.current = setInterval(() => {
        recordingDurationRef.current += 1;
        setRecordingTime(recordingDurationRef.current);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      showErrorToast("Microphone access denied");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const discardVoice = useCallback(() => {
    setVoiceBlob(null);
    setRecordingTime(0);
  }, []);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, stopRecording]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatPartner = React.useMemo(() => {
    if (!conversation) return null;
    if (conversation.type === "GROUP") {
      return {
        name: conversation.title,
        avatar: conversation.avatar || null,
      };
    }
    return {
      name: conversation.participant?.name,
      avatar: conversation.avatar || conversation.participant?.avatar || null,
    };
  }, [conversation]);

  // console.log("chatPartner", chatPartner);

  return (
    <section className="flex h-full w-full flex-col overflow-hidden bg-[#07121d]">
      {/* Header */}
      <div className="bg-[#0a1929] px-4 py-3 flex items-center justify-between border-b border-[#1a2336]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/chats" className="lg:hidden text-white">
            ←
          </Link>
          {/* <div className="size-10 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-bold">
            {chatPartner?.name?.slice(0, 2) || "C"}
          </div> */}
          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1a2336] border border-[#1F283D] overflow-hidden">
            {chatPartner?.avatar ? (
              <Image
                src={chatPartner?.avatar}
                alt={chatPartner?.name || "User Avatar"}
                fill
                className="object-cover"
                sizes="44px"
                unoptimized
              />
            ) : (
              <span className="text-sm font-semibold text-white">
                {chatPartner?.name?.slice(0, 2) || "C"}
              </span>
            )}
          </div>
          <div>
            <p className="text-white font-medium text-sm leading-tight">
              {chatPartner?.name || "User"}
            </p>
            <span className="text-[10px] text-green-500">Online</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="p-2 hover:bg-[#1a2336] rounded-lg text-white"
            onClick={() => setActiveCall({ type: "audio", isIncoming: false })}
          >
            <CallIcon />
          </button>
          <button
            className="p-2 hover:bg-[#1a2336] rounded-lg text-white"
            onClick={() => setActiveCall({ type: "video", isIncoming: false })}
          >
            <VideoIcon />
          </button>
          <Link
            href={`/dashboard/chats-details/${chatId}`}
            className="p-2 hover:bg-[#1a2336] rounded-lg text-white"
          >
            <WarningIcon />
          </Link>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('/chat-bg.png')] bg-repeat">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
            <p className="text-white text-xs">Loading...</p>
          </div>
        ) : (
          uniqueMessages.map((msg) => {
            const isMe = getMessageSenderId(msg) === currentUserId || msg.is_me;
            const messageText = getMessageContent(msg);
            const callContent = getCallContent(msg);
            const imageUrls = getMessageImageUrls(msg);
            const messageAttachments = msg?.attachments || [];
            const createdAt = getMessageCreatedAt(msg);

            if (callContent) {
              const isVideo = callContent.callKind === "VIDEO";
              const isMissed = callContent.status === "MISSED";
              const isOngoing = callContent.status === "ONGOING";

              return (
                <div
                  key={getMessageId(msg)}
                  className={cn(
                    "flex flex-col w-full",
                    isMe ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex max-w-[85%] items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm",
                      isMe
                        ? "rounded-tr-none bg-[#5f6ca0] text-white"
                        : "rounded-tl-none bg-[#17212c] text-[#B2B5B8]",
                      isOngoing && "border border-green-500/40",
                      isMissed && "border border-[#E9201D]/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full",
                        isOngoing
                          ? "bg-green-500/20 text-green-300"
                          : isMissed
                            ? "bg-[#E9201D]/20 text-[#ff706e]"
                            : "bg-white/10 text-white",
                      )}
                    >
                      {isVideo ? <VideoIcon /> : <CallIcon />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium leading-tight">
                        {getCallMessageLabel(msg)}
                      </p>
                      <p className="mt-1 text-[10px] opacity-70">
                        {createdAt
                          ? new Date(createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            // Skip empty text bubbles
            if (msg.kind === "TEXT" && !messageText && imageUrls.length === 0)
              return null;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col w-full",
                  isMe ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-2 text-sm rounded-2xl shadow-sm",
                    isMe
                      ? "bg-[#5f6ca0] text-white rounded-tr-none"
                      : "bg-[#17212c] text-[#B2B5B8] rounded-tl-none",
                  )}
                >
                  {messageAttachments.map((attachment: any, idx: number) => {
                    const fileUrl =
                      attachment?.url ||
                      attachment?.file_path ||
                      attachment?.filePath ||
                      "";

                    const fileType = attachment?.type || "";
                    const isImage =
                      fileType.startsWith("image/") || isImageUrl(fileUrl);
                    const isAudio =
                      fileType.startsWith("audio/") ||
                      /\.(mp3|wav|ogg|m4a|aac|flac|webm|opus)$/i.test(fileUrl);
                    const isVideo = fileType.startsWith("video/");

                    if (isImage && fileUrl) {
                      return (
                        <div
                          key={`image-${fileUrl || idx}`}
                          className="relative size-52 rounded-lg overflow-hidden my-1"
                        >
                          <Image
                            src={fileUrl}
                            alt="chat-media"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      );
                    }

                    if (isVideo && fileUrl) {
                      return (
                        <video
                          key={`video-${fileUrl}-${idx}`}
                          controls
                          src={fileUrl}
                          className="my-1 w-full max-w-64 rounded-lg"
                          preload="none"
                        />
                      );
                    }

                    if (isAudio && fileUrl) {
                      const attachmentDuration = attachment?.duration;
                      return (
                        <AudioPlayButton
                          key={`audio-${fileUrl}-${idx}`}
                          src={fileUrl}
                          duration={attachmentDuration}
                        />
                      );
                    }

                    if (!isImage && !isVideo && !isAudio && fileUrl) {
                      const fileName =
                        attachment?.name ||
                        (typeof fileUrl === "string"
                          ? fileUrl.split("/").pop()?.split("?")[0] ||
                            `file-${idx}`
                          : `file-${idx}`);

                      return (
                        <a
                          key={`${fileUrl}-${idx}`}
                          href={fileUrl}
                          className={cn(
                            "flex items-center gap-2 my-1 p-2 rounded-lg pointer-events-auto",
                            isMe ? "bg-white/10" : "bg-black/20",
                          )}
                        >
                          <span className="text-lg">
                            {getFileIcon(fileName)}
                          </span>
                          <span className="truncate flex-1 text-xs">
                            {fileName}
                          </span>
                        </a>
                      );
                    }

                    return null;
                  })}
                  {messageText ? (
                    <p className="whitespace-pre-wrap">{messageText}</p>
                  ) : null}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 px-1">
                  {createdAt
                    ? new Date(createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a1929] border-t border-[#1a2336]">
        {attachments.length > 0 || voiceBlob ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="flex items-center gap-1.5 rounded-full bg-[#17212c] pl-2 pr-1 py-1 text-xs text-white"
              >
                <span>{getFileIcon(file.name)}</span>
                <span className="max-w-30 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(file)}
                  className="ml-1 rounded-full p-0.5 hover:bg-[#0a1929] text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
            {voiceBlob && (
              <div className="flex items-center gap-1.5 rounded-full bg-[#17212c] pl-2 pr-1 py-1 text-xs text-white">
                <span>🎤</span>
                <span className="max-w-30 truncate">Voice message</span>
                <button
                  type="button"
                  onClick={discardVoice}
                  className="ml-1 rounded-full p-0.5 hover:bg-[#0a1929] text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ) : null}
        {isRecording && (
          <div className="mb-3 flex items-center gap-2 rounded-full bg-[#17212c] px-4 py-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
            <span className="text-xs text-white font-medium">
              Recording
              {/* {formatRecordingTime(recordingTime)} */}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-[#17212c] rounded-full px-4 border border-transparent focus-within:border-[#5f6ca0] transition-all">
          <button className="text-gray-400 hover:text-white">
            <PlusChatIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,text/plain,application/json,application/javascript,application/xml"
            multiple
            className="hidden"
            onChange={handleAttachmentChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-white"
            title="Attach file"
          >
            <ImageIcon />
          </button>
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              voiceBlob || isRecording
                ? "Voice message ready..."
                : "Write your message..."
            }
            className="flex-1 py-3 bg-transparent text-white outline-none text-sm"
          />
          <button className="text-gray-400 hover:text-white">
            <EmojiIcon />
          </button>
          <button
            onClick={
              isRecording
                ? stopRecording
                : voiceBlob
                  ? handleSendMessage
                  : draftMessage.trim() || attachments.length > 0
                    ? handleSendMessage
                    : startRecording
            }
            disabled={isSending && !isRecording}
            className={cn(
              "p-2 rounded-full transition-transform active:scale-90",
              isRecording
                ? "text-red-500"
                : voiceBlob || draftMessage.trim() || attachments.length > 0
                  ? "text-[#E9201D]"
                  : "text-gray-400",
              isSending && "opacity-50",
            )}
          >
            {isRecording ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : voiceBlob || draftMessage.trim() || attachments.length > 0 ? (
              <PlusChatIcon className="rotate-45" />
            ) : (
              <MicIcon />
            )}
          </button>
        </div>
      </div>

      {/* Incoming Call Notification */}
      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <div className="bg-[#0a1929] border border-[#1a2336] rounded-xl overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-semibold">
                      {incomingCall.type === "video" ? "📹" : "📞"}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {incomingCall.caller.name || "Someone"}
                      </p>
                      <p className="text-[12px] text-[#B2B5B8]">
                        {incomingCall.type === "video"
                          ? "Video Call"
                          : "Audio Call"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Accept the call
                      setActiveCall({
                        type: incomingCall.type,
                        isIncoming: true,
                      });
                      setIncomingCall(null);
                    }}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    ✓
                  </button>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      // Decline the call
                      setIncomingCall(null);
                      // Trigger the decline API call
                      const cookies = parseCookies();
                      const token = cookies.token || cookies.accessToken || "";
                      ChatsService.declineCall({
                        conversationId: chatId,
                        token,
                      }).catch((err) =>
                        console.error("Failed to decline call:", err),
                      );
                    }}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Screen - shown when call is active */}
      {activeCall && (
        <CallScreen
          conversationId={chatId}
          type={activeCall.type}
          isIncoming={activeCall.isIncoming}
          onCallEnd={() => setActiveCall(null)}
        />
      )}
    </section>
  );
}
