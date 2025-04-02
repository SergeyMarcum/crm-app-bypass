export interface Message {
  id: string;
  sender: string; // "Вы" или имя контакта
  content: string;
  timestamp: string; // Например, "20 минут назад"
}

export interface Contact {
  id: string;
  name: string;
  avatar: string; // URL аватара
  lastMessage: string;
  isOnline: boolean;
}
