import { CoreMessage, generateId, Message } from "ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import useAuthStore from "./useAuthStore";

interface ChatSession {
  messages: Message[];
  createdAt: string;
  title?: string;
}

interface State {
  base64Images: string[] | null;
  chats: Record<string, ChatSession>;
  currentChatId: string | null;
  selectedModel: string | null;
  userName: string | "Anonymous";
  isDownloading: boolean;
  downloadProgress: number;
  downloadingModel: string | null;
}

interface Actions {
  setBase64Images: (base64Images: string[] | null) => void;
  setCurrentChatId: (chatId: string) => void;
  setSelectedModel: (selectedModel: string) => void;
  getChatById: (chatId: string) => ChatSession | undefined;
  getMessagesById: (chatId: string) => Message[];
  saveMessages: (chatId: string, messages: Message[]) => void;
  saveMessagesToDB: (chatId: string, messages: Message[]) => Promise<void>;
  loadChatsFromDB: () => Promise<void>;
  createNewChat: (title?: string) => Promise<string>;
  addChat: (chatId: string, chat: ChatSession) => void;
  handleDelete: (chatId: string, messageId?: string) => void;
  setUserName: (userName: string) => void;
  startDownload: (modelName: string) => void;
  stopDownload: () => void;
  setDownloadProgress: (progress: number) => void;
  clearChats: () => void;
}

const useChatStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      base64Images: null,
      chats: {},
      currentChatId: null,
      selectedModel: null,
      userName: "Anonymous",
      isDownloading: false,
      downloadProgress: 0,
      downloadingModel: null, 

      setBase64Images: (base64Images) => set({ base64Images }),
      setUserName: (userName) => set({ userName }),

      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

      setSelectedModel: (selectedModel) => set({ selectedModel }),
      
      getChatById: (chatId) => {
        const state = get();
        return state.chats[chatId];
      },
      
      getMessagesById: (chatId) => {
        const state = get();
        return state.chats[chatId]?.messages || [];
      },

      saveMessages: (chatId, messages) => {
        set((state) => {
          const existingChat = state.chats[chatId];

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                messages: [...messages],
                createdAt: existingChat?.createdAt || new Date().toISOString(),
                title: existingChat?.title,
              },
            },
          };
        });
      },

      saveMessagesToDB: async (chatId, messages) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
          const response = await fetch(`/api/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ messages }),
          });

          if (!response.ok) {
            throw new Error('Failed to save messages to database');
          }
        } catch (error) {
          console.error('Error saving messages to database:', error);
        }
      },

      loadChatsFromDB: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
          const response = await fetch('/api/chats', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to load chats from database');
          }

          const { chats: dbChats } = await response.json();
          
          const chats: Record<string, ChatSession> = {};
          dbChats.forEach((chat: any) => {
            chats[chat.id] = {
              messages: chat.messages,
              createdAt: chat.createdAt,
              title: chat.title,
            };
          });

          set({ chats });
        } catch (error) {
          console.error('Error loading chats from database:', error);
        }
      },

      createNewChat: async (title) => {
        const { token } = useAuthStore.getState();
        
        if (!token) {
          const chatId = generateId();
          // Add chat to local state for guest users
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                messages: [],
                createdAt: new Date().toISOString(),
                title: title || 'New Chat',
              },
            },
          }));
          return chatId;
        }

        try {
          const response = await fetch('/api/chats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title }),
          });

          if (!response.ok) {
            throw new Error('Failed to create chat in database');
          }

          const { chat } = await response.json();
          
          // Add chat to local state for authenticated users
          set((state) => ({
            chats: {
              ...state.chats,
              [chat.id]: {
                messages: chat.messages || [],
                createdAt: chat.createdAt,
                title: chat.title,
              },
            },
          }));
          
          return chat.id;
        } catch (error) {
          console.error('Error creating chat in database:', error);
          const chatId = generateId();
          // Fallback: add to local state
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                messages: [],
                createdAt: new Date().toISOString(),
                title: title || 'New Chat',
              },
            },
          }));
          return chatId;
        }
      },

      handleDelete: (chatId, messageId) => {
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          // If messageId is provided, delete specific message
          if (messageId) {
            const updatedMessages = chat.messages.filter(
              (message) => message.id !== messageId
            );
            return {
              chats: {
                ...state.chats,
                [chatId]: {
                  ...chat,
                  messages: updatedMessages,
                },
              },
            };
          }

          // If no messageId, delete the entire chat
          const { [chatId]: _, ...remainingChats } = state.chats;
          
          // Also delete from database if user is authenticated
          const { token } = useAuthStore.getState();
          if (token) {
            fetch(`/api/chats/${chatId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }).catch(error => console.error('Error deleting chat from database:', error));
          }

          return {
            chats: remainingChats,
          };
        });
      },

      addChat: (chatId, chat) => {
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: chat,
          },
        }));
      },

      clearChats: () => {
        set({ chats: {}, currentChatId: null });
      },

      startDownload: (modelName) =>
        set({ isDownloading: true, downloadingModel: modelName, downloadProgress: 0 }),
      stopDownload: () =>
        set({ isDownloading: false, downloadingModel: null, downloadProgress: 0 }),
      setDownloadProgress: (progress) => set({ downloadProgress: progress }),
    }),
    {
      name: "nextjs-ollama-ui-state",
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedModel: state.selectedModel,
        userName: state.userName,
      }),
    }
  )
);export default useChatStore;