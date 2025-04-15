import type { Chat } from '@/types'

class SyncService {
  private channel: BroadcastChannel

  constructor() {
    this.channel = new BroadcastChannel('chat-sync')
  }

  broadcast(event: string, data: Chat[]) {
    // Make broadcast async and handle errors silently
    setTimeout(() => {
      try {
        // Create a simplified version of the data for broadcast
        const simplifiedData = data.map(chat => ({
          ...chat,
          messages: chat.messages.map(msg => ({
            ...msg,
            createdAt: msg.createdAt.toISOString(),
            updatedAt: msg.updatedAt.toISOString()
          }))
        }))
        this.channel.postMessage({ event, data: simplifiedData })
      } catch (error) {
        console.warn('Sync broadcast failed:', error)
        // Don't throw error - let the app continue
      }
    }, 0)
  }

  onUpdate(callback: (chats: Chat[]) => void) {
    this.channel.onmessage = (event) => {
      try {
        if (event.data.event === 'chats-updated') {
          // Convert ISO strings back to Date objects
          const chats = event.data.data.map((chat: any) => ({
            ...chat,
            messages: chat.messages.map((msg: any) => ({
              ...msg,
              createdAt: new Date(msg.createdAt),
              updatedAt: new Date(msg.updatedAt)
            }))
          }))
          callback(chats)
        }
      } catch (error) {
        console.warn('Sync update failed:', error)
        // Don't throw error - let the app continue
      }
    }
  }

  disconnect() {
    this.channel.close()
  }
}

export const syncService = new SyncService() 