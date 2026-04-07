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
    lastMessage: "Please check the assignment update.",
    time: "09:20 AM",
  },
  {
    id: 2,
    name: "Nafis Rahman",
    type: "student",
    status: "online",
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
    lastMessage: "Let's align on the exam schedule.",
    time: "Mon",
  },
  {
    id: 6,
    name: "Rafi Hasan",
    type: "student",
    status: "online",
    lastMessage: "I submitted the worksheet.",
    time: "10:05 AM",
  },
  {
    id: 7,
    name: "Nusrat Jahan",
    type: "student",
    status: "offline",
    lastActive: "12m",
    lastMessage: "Could you check my project draft?",
    time: "09:58 AM",
  },
  {
    id: 8,
    name: "Physics Group B",
    type: "group",
    status: "offline",
    lastActive: "1h",
    lastMessage: "Lab guideline updated.",
    time: "Today",
  },
  {
    id: 9,
    name: "Tanvir Hossain",
    type: "teacher",
    status: "online",
    lastMessage: "Join the staff sync at 4 PM.",
    time: "09:10 AM",
  },
  {
    id: 10,
    name: "Maliha Karim",
    type: "student",
    status: "offline",
    lastActive: "3h",
    lastMessage: "Thank you for today's class.",
    time: "Yesterday",
  },
  {
    id: 11,
    name: "Arif Chowdhury",
    type: "teacher",
    status: "online",
    lastMessage: "Exam routine has been finalized.",
    time: "08:20 AM",
  },
  {
    id: 12,
    name: "Sadia Akter",
    type: "student",
    status: "online",
    lastMessage: "Can I get extra practice sheets?",
    time: "07:55 AM",
  },
  {
    id: 13,
    name: "Chemistry Circle",
    type: "group",
    status: "offline",
    lastActive: "45m",
    lastMessage: "New chapter discussion thread started.",
    time: "Today",
  },
  {
    id: 14,
    name: "Ishrat Nabila",
    type: "student",
    status: "online",
    lastMessage: "I am ready for the viva.",
    time: "11:12 AM",
  },
  {
    id: 15,
    name: "Rakib Sir",
    type: "teacher",
    status: "offline",
    lastActive: "5h",
    lastMessage: "Please review the attendance report.",
    time: "Yesterday",
  },
  {
    id: 16,
    name: "Nabil Ahmed",
    type: "student",
    status: "online",
    lastMessage: "I will join in 10 minutes.",
    time: "10:42 AM",
  },
  {
    id: 17,
    name: "Biology Team",
    type: "group",
    status: "offline",
    lastActive: "30m",
    lastMessage: "Quiz answers are posted.",
    time: "Today",
  },
  {
    id: 18,
    name: "Sumi Rahman",
    type: "student",
    status: "offline",
    lastActive: "20m",
    lastMessage: "Please share the class recording.",
    time: "09:02 AM",
  },
  {
    id: 19,
    name: "Fahim Iqbal",
    type: "teacher",
    status: "online",
    lastMessage: "Tomorrow's session is confirmed.",
    time: "08:40 AM",
  },
  {
    id: 20,
    name: "Literature Group",
    type: "group",
    status: "offline",
    lastActive: "2h",
    lastMessage: "Reading list added to resources.",
    time: "Yesterday",
  },
  {
    id: 21,
    name: "Hasan Mahmud",
    type: "student",
    status: "online",
    lastMessage: "I need clarification on chapter 6.",
    time: "11:30 AM",
  },
  {
    id: 22,
    name: "Sharmeen Akhter",
    type: "teacher",
    status: "offline",
    lastActive: "1d",
    lastMessage: "Updated lesson plan is in the drive.",
    time: "Mon",
  },
  {
    id: 23,
    name: "Rezaul Karim",
    type: "student",
    status: "online",
    lastMessage: "I completed the revision task.",
    time: "10:18 AM",
  },
  {
    id: 24,
    name: "ICT Mentors",
    type: "group",
    status: "offline",
    lastActive: "8h",
    lastMessage: "Workshop schedule shared.",
    time: "Sun",
  },
  {
    id: 25,
    name: "Tania Sultana",
    type: "teacher",
    status: "online",
    lastMessage: "Please submit your progress update.",
    time: "09:35 AM",
  },
];

export const messagesByUserId: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "user",
      text: "Good morning! Did you review the lesson plan?",
      time: "09:12 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Yes, I reviewed it. Looks great for today.",
      time: "09:14 AM",
    },
    {
      id: 3,
      sender: "user",
      text: "Perfect. I will share the updated sheet shortly.",
      time: "09:15 AM",
    },
    {
      id: 4,
      sender: "user",
      text: "Perfect. I will share the updated sheet shortly.",
      time: "09:15 AM",
    },
    {
      id: 5,
      sender: "user",
      text: "Perfect. I will share the updated sheet shortly.",
      time: "09:15 AM",
    },
    {
      id: 6,
      sender: "me",
      text: "Perfect. I will share the updated sheet shortly.",
      time: "09:15 AM",
    },
    {
      id: 7,
      sender: "user",
      text: "Perfect. I will share the updated sheet shortly.",
      time: "09:15 AM",
    },
    {
      id: 8,
      sender: "me",
      text: "Perfect. I will share the updated sheet shortly.",
      time: "09:15 AM",
    },
    {
      id: 9,
      sender: "user",
      text: "Perfect. I will share the updated sheet shortly.",
      time: "09:15 AM",
    },
  ],
  2: [
    {
      id: 4,
      sender: "user",
      text: "Can I submit the homework tonight?",
      time: "08:01 AM",
    },
    {
      id: 5,
      sender: "me",
      text: "Yes, submission is open until 11:59 PM.",
      time: "08:05 AM",
    },
  ],
  3: [
    {
      id: 6,
      sender: "user",
      text: "Reminder: group quiz starts at 3 PM.",
      time: "Yesterday",
    },
    {
      id: 7,
      sender: "me",
      text: "Thanks, everyone please be on time.",
      time: "Yesterday",
    },
  ],
  4: [
    {
      id: 8,
      sender: "user",
      text: "I need help with chapter 4.",
      time: "Mon",
    },
    {
      id: 9,
      sender: "me",
      text: "Sure, we can do a quick revision session tomorrow.",
      time: "Mon",
    },
  ],
  5: [
    {
      id: 10,
      sender: "user",
      text: "Please confirm the exam meeting slot.",
      time: "Tue",
    },
    {
      id: 11,
      sender: "me",
      text: "Confirmed for 4 PM. Thanks.",
      time: "Tue",
    },
  ],
};

export function getConversationById(chatId: number) {
  return conversations.find((item) => item.id === chatId);
}
