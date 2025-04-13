export type MessageType = 'user' | 'agent'
export type MessageStatus = 'sent' | 'pending' | 'error'

export interface Message {
  id: string
  type: MessageType
  content: string
  createdAt: Date
  updatedAt: Date
  status: MessageStatus
}

export interface Chat {
  id: string
  personaId: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export interface Persona {
  id: string
  name: string
  icon: string
}

export interface ChatState {
  chatList: Chat[]
  activeChat: Chat | null
  errorState: string | null
  isSyncing: boolean
}

export interface SyncState {
  syncedChatList: Chat[]
} 