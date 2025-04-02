import { create } from "zustand";
import { Contact, Message } from "./types";

interface ChatState {
  contacts: Contact[];
  selectedContact: Contact | null;
  messages: Message[];
  setSelectedContact: (contact: Contact) => void;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  contacts: [
    {
      id: "1",
      name: "Люси Лавендер",
      avatar: "/static/img/avatars/avatar-1.jpg",
      lastMessage: "Отправлено фото",
      isOnline: true,
    },
    {
      id: "2",
      name: "Реми Шарп",
      avatar: "/static/img/avatars/avatar-2.jpg",
      lastMessage: "Кофе?",
      isOnline: true,
    },
    {
      id: "3",
      name: "Кассандра Миксон",
      avatar: "/static/img/avatars/avatar-3.jpg",
      lastMessage: "Привет! 👋",
      isOnline: false,
    },
  ],
  selectedContact: null,
  messages: [],
  setSelectedContact: (contact) =>
    set(() => {
      // Моковые сообщения для выбранного контакта
      const mockMessages: Message[] = contact
        ? [
            {
              id: "1",
              sender: contact.name,
              content:
                "Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.",
              timestamp: "20 минут назад",
            },
            {
              id: "2",
              sender: "Вы",
              content:
                "Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.",
              timestamp: "12 минут назад",
            },
            {
              id: "3",
              sender: contact.name,
              content: "Cum ea graeci tractatos. 😄",
              timestamp: "8 минут назад",
            },
            {
              id: "4",
              sender: "Вы",
              content:
                "Cras pulvinar, sapien id vehicula aliquet, diam velit elementum orci. 👍",
              timestamp: "5 минут назад",
            },
            {
              id: "5",
              sender: contact.name,
              content:
                "Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.",
              timestamp: "3 минуты назад",
            },
          ]
        : [];
      return { selectedContact: contact, messages: mockMessages };
    }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
