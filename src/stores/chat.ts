import { defineStore } from 'pinia'
import type { Chat, Message, ChatState, Persona } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import * as api from '@/services/api'
import { storage } from '@/services/storage'
import { syncService } from '@/services/sync'
import { db } from '@/services/db'
import { rateLimiter } from '@/services/rateLimiter'

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    chatList: [],
    activeChat: null,
    errorState: null,
    isSyncing: false,
    isInitialized: false,
    lastFailedMessage: null
  }),

  getters: {
    sortedChatList: state => {
      return [...state.chatList].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    },

    mostRecentChat: state => {
      if (state.chatList.length === 0) return null
      return [...state.chatList].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0]
    }
  },

  actions: {
    async initialize() {
      try {
        // Initialize IndexedDB
        await db.init()
        const savedChats = await storage.loadChats()
        if (savedChats) {
          this.chatList = savedChats
        }
        this.isInitialized = true
      } catch (error) {
        console.error('Failed to initialize store:', error)
        this.errorState = 'Failed to load chats. Please try refreshing the page.'
      }
    },

    async initializeWithChat(chatId: string | null) {
      if (!this.isInitialized) {
        await this.initialize()
      }

      if (chatId) {
        const chat = this.chatList.find(c => c.id === chatId)
        if (chat) {
          this.activeChat = chat
          this.errorState = null
          return true
        }
      }

      if (this.chatList.length > 0) {
        this.setActiveChat(this.mostRecentChat!.id)
        return true
      }

      return false
    },

    async sendMessage(content: string) {
      if (!this.activeChat) return

      // Clear any existing error state
      this.errorState = null
      this.lastFailedMessage = null

      // Check rate limit
      const rateLimit = await rateLimiter.checkRateLimit(this.activeChat.id)
      if (!rateLimit.allowed) {
        if (rateLimit.reason) {
          this.errorState = rateLimit.reason
          return
        }
        // If no reason but not allowed, it's a cooldown - just return silently
        return
      }

      const userMessage: Message = {
        id: uuidv4(),
        content,
        type: 'user',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.activeChat.messages.push(userMessage)
      await storage.saveChats(this.chatList)

      try {
        const reply = await api.sendMessage(
          content,
          this.activeChat.personaId,
          this.activeChat.celebrityId
        )

        if (
          this.activeChat.personaId === 'mystery' &&
          reply.celebrity &&
          !this.activeChat.celebrityId
        ) {
          this.activeChat.celebrityId = reply.celebrity
        }

        const aiMessage: Message = {
          id: uuidv4(),
          content: reply.content,
          type: 'agent',
          status: 'sent',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        userMessage.status = 'sent'
        this.activeChat.messages.push(aiMessage)
        await storage.saveChats(this.chatList)

        this.syncChats()
      } catch (error) {
        console.error('Failed to send message:', error)
        this.errorState = 'Failed to send message. Please try again.'
        userMessage.status = 'error'
        this.lastFailedMessage = content
        await storage.saveChats(this.chatList)
        throw error
      }
    },

    async retryLastFailedMessage() {
      if (this.lastFailedMessage) {
        const content = this.lastFailedMessage
        this.lastFailedMessage = null
        await this.sendMessage(content)
      }
    },

    syncChats() {
      try {
        syncService.broadcast('chats-updated', this.chatList)
      } catch (error) {
        console.warn('Failed to sync chats:', error)
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

      if (this.chatList.length >= 5) {
        const sortedChats = this.sortedChatList
        this.chatList = this.chatList.filter(chat => chat.id !== sortedChats[4].id)
      }

      this.chatList.push(newChat)
      this.activeChat = newChat

      const welcomeMessage: Message = {
        id: uuidv4(),
        type: 'agent',
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
        content: this.getWelcomeMessage(persona.id)
      }

      newChat.messages.push(welcomeMessage)
      await storage.saveChats(this.chatList)
      return newChat
    },

    getWelcomeMessage(personaId: string): string {
      const messages: Record<string, string> = {
        therapist:
          'You are talking with a professional therapist. Feel free to share your thoughts and feelings in a safe, confidential space.',
        tutor:
          'You are talking with a language tutor. Feel free to practice and ask any questions about language learning.',
        chef: 'You are talking with a master chef. Feel free to ask about recipes, cooking techniques, and culinary tips.',
        trainer:
          'You are talking with a fitness trainer. Feel free to ask about workouts, nutrition, and achieving your fitness goals.',
        mystery:
          "You are talking with a well-known celebrity! They'll share authentic stories and experiences, but won't reveal their identity directly. Try to guess who they are through your conversation!"
      }

      const content = {
        content: messages[personaId] || 'Welcome to the chat!'
      }

      return JSON.stringify(content)
    },

    setActiveChat(chatId: string) {
      const chat = this.chatList.find(c => c.id === chatId)
      if (chat) {
        this.activeChat = chat
        this.errorState = null
      }
    },

    async removeChat(chatId: string) {
      this.chatList = this.chatList.filter(chat => chat.id !== chatId)
      if (this.activeChat?.id === chatId) {
        this.activeChat = this.mostRecentChat
      }
      // Clear rate limits when removing a chat
      rateLimiter.clearLimits(chatId)
      await storage.saveChats(this.chatList)
    }
  }
})
