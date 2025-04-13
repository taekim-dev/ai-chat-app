import type { Chat } from '@/types'

const STORAGE_KEY = 'ai-chat-app-data'

export const storage = {
  saveChats(chats: Chat[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    } catch (error) {
      console.error('Failed to save chats to localStorage:', error)
    }
  },

  loadChats(): Chat[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []

      const chats = JSON.parse(data)
      
      // Convert string dates back to Date objects
      return chats.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
          updatedAt: new Date(msg.updatedAt)
        }))
      }))
    } catch (error) {
      console.error('Failed to load chats from localStorage:', error)
      return []
    }
  },

  clearChats(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear chats from localStorage:', error)
    }
  }
} 