// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import CallIcon from "../icons/chats/CallIcon";
// import VideoIcon from "../icons/chats/VideoIcon";
// import WarningIcon from "../icons/chats/WarningIcon";
// import PlusChatIcon from "../icons/chats/PlusChatIcon";
// import ImageIcon from "../icons/chats/ImageIcon";
// import MicIcon from "../icons/chats/MicIcon";
// import EmojiIcon from "../icons/chats/EmojiIcon";
// import { parseCookies } from "nookies";
// import { ChatsService } from "@/service/chats/chats.service";
// import Image from "next/image";
// import { connectSocket } from "@/lib/Socket";

// type ChatAreaProps = {
//   chatId: string;
// };

// export default function ChatArea({ chatId }: ChatAreaProps) {
//   const [draftMessage, setDraftMessage] = useState("");
//   const [messages, setMessages] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Replace this with your actual logged-in admin ID from your auth state/context
//   const MY_ID = "cmm1euh120000kgqgmimhm6gf";

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const fetchMessages = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const cookies = parseCookies();
//       const token = cookies.token || cookies.accessToken || "";
//       const res = await ChatsService.getConversationById({ id: chatId, token });

//       console.log("res==========", res);

//       setMessages(res?.data?.items || []);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [chatId]);

//   useEffect(() => {
//     fetchMessages();
//     setDraftMessage("");
//   }, [fetchMessages]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const socketRef = useRef<any>(null);
//   useEffect(() => {
//     const cookies = parseCookies();
//     const token = cookies.token || "";

//     if (!token) return;

//     socketRef.current = connectSocket(token);

//     socketRef.current.on("message:new", (msg: any) => {
//       if (msg.conversationId === chatId) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socketRef.current?.off("message:new");
//     };
//   }, [chatId]);

//   // const handleSendMessage = () => {
//   //   if (!draftMessage.trim()) return;

//   //   // Local UI update (Optimistic UI)
//   //   const newMessage = {
//   //     id: Date.now().toString(),
//   //     senderId: MY_ID,
//   //     content: { text: draftMessage },
//   //     createdAt: new Date().toISOString(),
//   //     kind: "TEXT",
//   //   };

//   //   setMessages((prev) => [...prev, newMessage]);
//   //   setDraftMessage("");

//   //   // API Call would go here:
//   //   // ChatsService.sendMessage({ conversationId: chatId, text: draftMessage, ... })
//   // };

//   const handleSendMessage = async () => {
//     if (!draftMessage.trim()) return;

//     const cookies = parseCookies();
//     const token = cookies.token || "";

//     const text = draftMessage;
//     setDraftMessage("");

//     // Optimistic UI
//     const tempMsg = {
//       id: Date.now().toString(),
//       senderId: MY_ID,
//       content: { text },
//       createdAt: new Date().toISOString(),
//       kind: "TEXT",
//     };

//     setMessages((prev) => [...prev, tempMsg]);

//     try {
//       // Send via socket (REAL-TIME)
//       socketRef.current.emit("message:send", {
//         conversationId: chatId,
//         kind: "TEXT",
//         content: { text },
//       });

//       // OR fallback API
//       await ChatsService.sendMessage({
//         conversationId: chatId,
//         token,
//         data: { text },
//       });
//     } catch (err) {
//       console.error("Send failed", err);
//     }
//   };

//   const handleComposerKeyDown = (
//     event: React.KeyboardEvent<HTMLInputElement>,
//   ) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl">
//       {/* Header */}
//       <div className="bg-[#0a1929] px-4 py-3 sm:px-5">
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex min-w-0 items-center gap-3">
//             <Link href="/dashboard/chats" className="lg:hidden text-white">
//               ←
//             </Link>
//             <div className="size-11 rounded-full bg-[#1a2336] flex items-center justify-center text-white font-bold border border-[#1F283D]">
//               {/* Profile placeholder logic */}
//               {messages[0]?.sender?.name?.slice(0, 2).toUpperCase() || "CH"}
//             </div>
//             <div className="min-w-0">
//               <p className="truncate text-base text-white font-medium">
//                 {messages[0]?.sender?.name || "Conversation"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <button className="p-3 hover:bg-[#45537b] rounded-xl transition-colors">
//               <CallIcon />
//             </button>
//             <button className="p-3 hover:bg-[#45537b] rounded-xl transition-colors">
//               <VideoIcon />
//             </button>
//             <button className="p-3 hover:bg-[#45537b] rounded-xl transition-colors">
//               <WarningIcon />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5 bg-[#07121d] custom-scrollbar">
//         <div className="flex flex-col space-y-2">
//           {isLoading ? (
//             <p className="text-center text-[#5F6CA0] py-10">
//               Loading messages...
//             </p>
//           ) : (
//             messages.map((message, index) => {
//               const isMe = message.senderId === MY_ID;
//               const prevMsg = messages[index - 1];
//               const isSameAsPrev = prevMsg?.senderId === message.senderId;

//               return (
//                 <div
//                   key={message.id}
//                   className={cn(
//                     "flex flex-col",
//                     isMe ? "items-end" : "items-start",
//                   )}
//                 >
//                   {!isSameAsPrev && (
//                     <span className="text-[10px] text-[#5F6CA0] mb-1 px-1">
//                       {new Date(message.createdAt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   )}

//                   <div
//                     className={cn(
//                       "w-fit max-w-[85%] px-4 py-2 text-sm rounded-2xl",
//                       isMe
//                         ? "bg-[#5f6ca0] text-white rounded-tr-none"
//                         : "bg-[#17212c] text-[#B2B5B8] rounded-tl-none",
//                       isSameAsPrev &&
//                         (isMe ? "rounded-tr-2xl" : "rounded-tl-2xl"),
//                     )}
//                   >
//                     {message.kind === "TEXT" ? (
//                       <p className="whitespace-pre-wrap wrap-break-word">
//                         {message.content?.text}
//                       </p>
//                     ) : message.kind === "IMAGE" ? (
//                       <div className="relative size-60 rounded-lg overflow-hidden">
//                         <Image
//                           src={message.media_Url}
//                           alt="chat-img"
//                           fill
//                           className="object-cover"
//                           unoptimized
//                         />
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="p-4 sm:p-5 bg-[#07121d]">
//         <div className="flex items-center gap-3">
//           <button className="hover:opacity-80 transition-opacity">
//             <PlusChatIcon />
//           </button>
//           <button className="hover:opacity-80 transition-opacity">
//             <ImageIcon />
//           </button>

//           <div className="flex-1 relative">
//             <button className="absolute right-4 top-1/2 -translate-y-1/2">
//               <EmojiIcon />
//             </button>
//             <input
//               type="text"
//               value={draftMessage}
//               onChange={(e) => setDraftMessage(e.target.value)}
//               onKeyDown={handleComposerKeyDown}
//               className="w-full p-4 bg-[#0a1929] rounded-full placeholder:text-[#8C9196] text-white outline-none focus:ring-1 ring-[#5f6ca0]"
//               placeholder="Type message..."
//             />
//           </div>

//           <button
//             onClick={handleSendMessage}
//             className="hover:scale-110 transition-transform"
//           >
//             {draftMessage.trim() ? (
//               <div className="bg-[#E9201D] p-2 rounded-full">
//                 <PlusChatIcon className="rotate-45" />
//               </div>
//             ) : (
//               <MicIcon />
//             )}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";
import { cn } from "@/lib/utils";

// Services & Socket
import { ChatsService } from "@/service/chats/chats.service";
import { connectSocket } from "@/lib/Socket";
import { showErrorToast } from "@/lib/hotToast";

// Icons
import CallIcon from "../icons/chats/CallIcon";
import VideoIcon from "../icons/chats/VideoIcon";
import WarningIcon from "../icons/chats/WarningIcon";
import PlusChatIcon from "../icons/chats/PlusChatIcon";
import ImageIcon from "../icons/chats/ImageIcon";
import MicIcon from "../icons/chats/MicIcon";
import EmojiIcon from "../icons/chats/EmojiIcon";

type ChatAreaProps = {
  chatId: string;
};

export default function ChatArea({ chatId }: ChatAreaProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

      const res = await ChatsService.getConversationById({
        id: chatId,
        token,
      });

      setMessages(res?.data?.items || []);
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

  //  SOCKET (REAL-TIME)
  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token || cookies.accessToken || "";
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    // JOIN ROOM
    socket.emit("conversation:join", { conversationId: chatId });

    const handleNewMessage = (msg: any) => {
      if (msg.conversationId !== chatId) return;

      setMessages((prev) => {
        //  remove optimistic duplicate
        const filtered = prev.filter(
          (m) =>
            !(
              m.id?.toString().startsWith("temp-") &&
              m.content?.text === msg.content?.text
            ),
        );

        // avoid duplicate
        if (filtered.find((m) => m.id === msg.id)) return filtered;

        return [...filtered, msg];
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.emit("conversation:leave", { conversationId: chatId });
      socket.off("message:new", handleNewMessage);
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //  SEND MESSAGE
  const handleSendMessage = async () => {
    if (!draftMessage.trim()) return;

    const cookies = parseCookies();
    const token = cookies.token || cookies.accessToken || "";
    const text = draftMessage;

    setDraftMessage("");

    const payload = {
      kind: "TEXT",
      content: { text },
    };

    // Optimistic UI
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      ...payload,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      //  REAL-TIME
      socketRef.current?.emit("message:send", {
        conversationId: chatId,
        ...payload,
      });

      // BACKUP API
      await ChatsService.sendMessage({
        conversationId: chatId,
        token,
        data: payload,
      });
    } catch (err) {
      console.error("Send failed", err);

      // rollback UI
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="flex h-full w-full flex-col overflow-hidden bg-[#07121d]">
      {/* Header */}
      <div className="bg-[#0a1929] px-4 py-3 flex items-center justify-between border-b border-[#1a2336]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/chats" className="lg:hidden text-white">
            ←
          </Link>
          <div className="size-10 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-bold">
            {messages[0]?.sender?.name?.slice(0, 1) || "C"}
          </div>
          <div>
            <p className="text-white font-medium text-sm leading-tight">
              {messages[0]?.sender?.name || "User"}
            </p>
            <span className="text-[10px] text-green-500">Online</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-[#1a2336] rounded-lg text-white">
            <CallIcon />
          </button>
          <button className="p-2 hover:bg-[#1a2336] rounded-lg text-white">
            <VideoIcon />
          </button>
          <button className="p-2 hover:bg-[#1a2336] rounded-lg text-white">
            <WarningIcon />
          </button>
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
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            // Skip empty text bubbles
            if (msg.kind === "TEXT" && !msg.content?.text) return null;

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
                  {msg.kind === "TEXT" ? (
                    <p className="whitespace-pre-wrap">{msg.content?.text}</p>
                  ) : msg.kind === "IMAGE" ? (
                    <div className="relative size-52 rounded-lg overflow-hidden my-1">
                      <Image
                        src={msg.media_Url}
                        alt="chat-media"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a1929] border-t border-[#1a2336]">
        <div className="flex items-center gap-2 bg-[#17212c] rounded-full px-4 border border-transparent focus-within:border-[#5f6ca0] transition-all">
          <button className="text-gray-400 hover:text-white">
            <PlusChatIcon />
          </button>
          <button className="text-gray-400 hover:text-white">
            <ImageIcon />
          </button>
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your message..."
            className="flex-1 py-3 bg-transparent text-white outline-none text-sm"
          />
          <button className="text-gray-400 hover:text-white">
            <EmojiIcon />
          </button>
          <button
            onClick={handleSendMessage}
            className={cn(
              "p-2 rounded-full transition-transform active:scale-90",
              draftMessage.trim() ? "text-[#E9201D]" : "text-gray-400",
            )}
          >
            {draftMessage.trim() ? (
              <PlusChatIcon className="rotate-45" />
            ) : (
              <MicIcon />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
