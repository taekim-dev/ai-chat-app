import type { Chat } from '@/types'
import { db } from './db'

const STORAGE_KEY = 'ai-chat-app-data'

export const storage = {
  async saveChats(chats: Chat[]): Promise<void> {
    try {
      // Try IndexedDB first
      await db.saveChats(chats)
    } catch (error) {
      console.warn('Failed to save to IndexedDB, falling back to localStorage:', error)
      try {
        // Fallback to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
      } catch (error) {
        console.error('Failed to save chats to localStorage:', error)
      }
    }
  },

  async loadChats(): Promise<Chat[]> {
    try {
      // Try IndexedDB first
      return await db.loadChats()
    } catch (error) {
      console.warn('Failed to load from IndexedDB, falling back to localStorage:', error)
      try {
        // Fallback to localStorage
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
    }
  },

  async clearChats(): Promise<void> {
    try {
      // Try IndexedDB first
      await db.clearChats()
    } catch (error) {
      console.warn('Failed to clear IndexedDB, falling back to localStorage:', error)
      try {
        // Fallback to localStorage
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to clear chats from localStorage:', error)
      }
    }
  }
} 