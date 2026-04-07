export type ConversationType = "teacher" | "student" | "group";

export type Conversation = {
  id: number;
  name: string;
  type: ConversationType;
  status: "online" | "offline";
  lastActive?: string;
  lastMessage: string;
  time: string;
};

export type ChatMessage = {
  id: number;
  sender: "me" | "user";
  text: string;
  time: string;
};

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "Sarah Ahmed",
    type: "teacher",
    status: "online",
    lastActive: undefined,
    lastMessage: "Please check the assignment update.",
    time: "09:20 AM",
  },
  {
    id: 2,
    name: "Nafis Rahman",
    type: "student",
    status: "online",
    lastActive: undefined,
    lastMessage: "Can we reschedule tomorrow's class?",
    time: "08:45 AM",
  },
  {
    id: 3,
    name: "Math Group A",
    type: "group",
    status: "offline",
    lastActive: "5m",
    lastMessage: "New materials have been uploaded.",
    time: "Yesterday",
  },
  {
    id: 4,
    name: "Amina Noor",
    type: "student",
    status: "offline",
    lastActive: "2h",
    lastMessage: "Thank you for the feedback.",
    time: "Yesterday",
  },
  {
    id: 5,
    name: "Mahin Sir",
    type: "teacher",
    status: "online",
    lastActive: undefined,
    lastMessage: "Let's align on the exam schedule.",
    time: "Mon",
  },
];

export const messagesByUserId: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: "user", text: "Good morning! Did you review the lesson plan?", time: "09:12 AM" },
    { id: 2, sender: "me", text: "Yes, I reviewed it. Looks great for today.", time: "09:14 AM" },
    { id: 3, sender: "user", text: "Perfect. I will share the updated sheet shortly.", time: "09:15 AM" },
    { id: 4, sender: "user", text: "Perfect. I will share the updated sheet shortly.", time: "09:15 AM" },
    { id: 5, sender: "user", text: "Perfect. I will share the updated sheet shortly.", time: "09:15 AM" },
    { id: 6, sender: "me", text: "Perfect. I will share the updated sheet shortly.", time: "09:15 AM" },
    { id: 7, sender: "user", text: "Perfect. I will share the updated sheet shortly.", time: "09:15 AM" },
    { id: 8, sender: "me", text: "Perfect. I will share the updated sheet shortly.", time: "09:15 AM" },
    { id: 9, sender: "user", text: "Perfect. I will share the updated sheet shortly.", time: "09:15 AM" },
  ],
  2: [
    { id: 4, sender: "user", text: "Can I submit the homework tonight?", time: "08:01 AM" },
    { id: 5, sender: "me", text: "Yes, submission is open until 11:59 PM.", time: "08:05 AM" },
  ],
  3: [
    { id: 6, sender: "user", text: "Reminder: group quiz starts at 3 PM.", time: "Yesterday" },
    { id: 7, sender: "me", text: "Thanks, everyone please be on time.", time: "Yesterday" },
  ],
  4: [
    { id: 8, sender: "user", text: "I need help with chapter 4.", time: "Mon" },
    { id: 9, sender: "me", text: "Sure, we can do a quick revision session tomorrow.", time: "Mon" },
  ],
  5: [
    { id: 10, sender: "user", text: "Please confirm the exam meeting slot.", time: "Tue" },
    { id: 11, sender: "me", text: "Confirmed for 4 PM. Thanks.", time: "Tue" },
  ],
};

export function getConversationById(chatId: number) {
  return conversations.find((item) => item.id === chatId);
}
