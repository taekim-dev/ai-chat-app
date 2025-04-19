import type { Chat } from '@/types'
import { SYNC_CONFIG } from '@/config'
import { NetworkError } from '@/utils/errors'
import { validateChat } from '@/utils/validation'

class SyncService {
  private channel: BroadcastChannel | null = null
  private reconnectTimeout: number | null = null
  private isConnected = false

  constructor() {
    this.connect()
  }

  private connect(): void {
    try {
      this.channel = new BroadcastChannel(SYNC_CONFIG.CHANNEL_NAME)
      this.isConnected = true
      console.log('Sync service connected')
    } catch (error) {
      console.error('Failed to connect sync service:', error)
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout === null && !this.isConnected) {
      this.reconnectTimeout = window.setTimeout(() => {
        this.reconnectTimeout = null
        this.connect()
      }, SYNC_CONFIG.RECONNECT_DELAY_MS)
    }
  }

  broadcast(event: string, data: Chat[]): void {
    if (!this.channel || !this.isConnected) {
      this.scheduleReconnect()
      throw new NetworkError('Sync service not connected')
    }

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
        this.channel?.postMessage({ event, data: simplifiedData })
      } catch (error) {
        console.warn('Sync broadcast failed:', error)
        // Don't throw error - let the app continue
      }
    }, 0)
  }

  onUpdate(callback: (chats: Chat[]) => void): void {
    if (!this.channel) {
      this.connect()
    }

    this.channel!.onmessage = (event) => {
      try {
        if (event.data.event === 'chats-updated') {
          // Convert ISO strings back to Date objects and validate
          const chats = event.data.data.map((chat: any) => {
            const validChat = {
              ...chat,
              messages: chat.messages.map((msg: any) => ({
                ...msg,
                createdAt: new Date(msg.createdAt),
                updatedAt: new Date(msg.updatedAt)
              }))
            }
            return validateChat(validChat)
          })
          callback(chats)
        }
      } catch (error) {
        console.warn('Sync update failed:', error)
        // Don't throw error - let the app continue
      }
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    if (this.channel) {
      this.channel.close()
      this.channel = null
    }
    this.isConnected = false
  }
}

export const syncService = new SyncService() 