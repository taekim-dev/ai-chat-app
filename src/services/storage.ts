import type { Chat } from '@/types'
import { db } from './db'

export const storage = {
  async saveChats(chats: Chat[]): Promise<void> {
    await db.saveChats(chats)
  },

  async loadChats(): Promise<Chat[]> {
    return await db.loadChats()
  },

  async clearChats(): Promise<void> {
    await db.clearChats()
  }
} 