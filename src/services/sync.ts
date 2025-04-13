import type { Chat } from '@/types'

const SYNC_CHANNEL = 'ai-chat-sync'

export class SyncService {
  private channel: BroadcastChannel
  private onUpdateCallback: ((chats: Chat[]) => void) | null = null

  constructor() {
    this.channel = new BroadcastChannel(SYNC_CHANNEL)
    this.channel.onmessage = this.handleMessage.bind(this)
  }

  onUpdate(callback: (chats: Chat[]) => void): void {
    this.onUpdateCallback = callback
  }

  postUpdate(chats: Chat[]): void {
    this.channel.postMessage({
      type: 'UPDATE',
      payload: chats
    })
  }

  private handleMessage(event: MessageEvent): void {
    if (event.data.type === 'UPDATE' && this.onUpdateCallback) {
      // Convert dates back to Date objects
      const chats = event.data.payload.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
          updatedAt: new Date(msg.updatedAt)
        }))
      }))
      this.onUpdateCallback(chats)
    }
  }

  disconnect(): void {
    this.channel.close()
  }
} 