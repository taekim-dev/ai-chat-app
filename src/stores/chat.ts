import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { Chat, Message, ChatState, Persona } from '@/types'
import { api } from '@/services/api'
import { storage } from '@/services/storage'
import { SyncService } from '@/services/sync'

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    chatList: [],
    activeChat: null,
    errorState: null,
    isSyncing: false
  }),

  getters: {
    sortedChatList: (state) => {
      return [...state.chatList].sort((a, b) => 
        b.updatedAt.getTime() - a.updatedAt.getTime()
      )
    }
  },

  actions: {
    initialize() {
      // Load chats from storage
      this.chatList = storage.loadChats()
      
      // Initialize sync service
      const syncService = new SyncService()
      syncService.onUpdate((chats) => {
        this.chatList = chats
        storage.saveChats(chats)
      })

      // If there are chats, set the most recent as active
      if (this.chatList.length > 0) {
        this.activeChat = this.sortedChatList[0]
      }
    },

    async createChat(persona: Persona) {
      const newChat: Chat = {
        id: uuidv4(),
        personaId: persona.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: []
      }

      // Remove oldest chat if limit reached
      if (this.chatList.length >= 5) {
        const sortedChats = this.sortedChatList
        this.chatList = this.chatList.filter(chat => chat.id !== sortedChats[4].id)
      }

      this.chatList.push(newChat)
      this.activeChat = newChat
      
      storage.saveChats(this.chatList)
      return newChat
    },

    async sendMessage(content: string) {
      if (!this.activeChat) return

      const message: Message = {
        id: uuidv4(),
        content,
        type: 'user',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Add user message
      this.activeChat.messages.push(message)
      this.activeChat.updatedAt = new Date()
      
      try {
        // Send to API and get response
        const response = await api.sendMessage(
          { content, createdAt: message.createdAt, updatedAt: message.updatedAt },
          this.activeChat.personaId
        )

        // Update message status
        message.status = 'sent'
        
        // Add AI response
        this.activeChat.messages.push(response)
        this.activeChat.updatedAt = new Date()
        
        this.errorState = null
      } catch (error) {
        message.status = 'error'
        this.errorState = "We're having trouble reaching your agent. Please try again."
      }

      storage.saveChats(this.chatList)
    },

    setActiveChat(chatId: string) {
      const chat = this.chatList.find(c => c.id === chatId)
      if (chat) {
        this.activeChat = chat
        this.errorState = null
      }
    },

    removeChat(chatId: string) {
      this.chatList = this.chatList.filter(chat => chat.id !== chatId)
      if (this.activeChat?.id === chatId) {
        this.activeChat = this.chatList[0] || null
      }
      storage.saveChats(this.chatList)
    }
  }
}) 