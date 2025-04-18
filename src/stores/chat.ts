import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Chat, Message, ChatState, Persona } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import * as api from '@/services/api'
import { storage } from '@/services/storage'
import { syncService } from '@/services/sync'

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
      const savedChats = storage.loadChats()
      if (savedChats) {
        this.chatList = savedChats
      }
    },

    async sendMessage(content: string) {
      if (!this.activeChat) return

      // Create and add user message
      const userMessage: Message = {
        id: uuidv4(),
        content,
        type: 'user',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      this.activeChat.messages.push(userMessage)
      storage.saveChats(this.chatList)

      try {
        // Send message to API with persona ID
        const reply = await api.sendMessage(content, this.activeChat.personaId)
        
        // Create and add AI response
        const aiMessage: Message = {
          id: uuidv4(),
          content: reply,
          type: 'agent',
          status: 'sent',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        userMessage.status = 'sent'
        this.activeChat.messages.push(aiMessage)
        storage.saveChats(this.chatList)
        
        // Sync in background - don't await or catch errors
        this.syncChats()
      } catch (error) {
        userMessage.status = 'error'
        this.errorState = 'Failed to send message. Please try again.'
        storage.saveChats(this.chatList)
        throw error
      }
    },

    // New method to handle sync separately
    syncChats() {
      try {
        syncService.broadcast('chats-updated', this.chatList)
      } catch (error) {
        console.warn('Failed to sync chats:', error)
        // Don't set error state or throw - sync is non-critical
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
      
      // Add welcome message based on persona
      const welcomeMessage: Message = {
        id: uuidv4(),
        type: 'agent',
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
        content: this.getWelcomeMessage(persona.id)
      }
      
      newChat.messages.push(welcomeMessage)
      storage.saveChats(this.chatList)
      return newChat
    },

    getWelcomeMessage(personaId: string): string {
      const messages: Record<string, string> = {
        therapist: "You are talking with a professional therapist. Feel free to share your thoughts and feelings in a safe, confidential space.",
        tutor: "You are talking with a language tutor. Feel free to practice and ask any questions about language learning.",
        chef: "You are talking with a master chef. Feel free to ask about recipes, cooking techniques, and culinary tips.",
        trainer: "You are talking with a fitness trainer. Feel free to ask about workouts, nutrition, and achieving your fitness goals.",
        mystery: "You are talking with a well-known celebrity! They'll share authentic stories and experiences, but won't reveal their identity directly. Try to guess who they are through your conversation!"
      }
      
      // Format the message in the same structure as API responses
      const content = {
        content: messages[personaId] || "Welcome to the chat!"
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

    removeChat(chatId: string) {
      this.chatList = this.chatList.filter(chat => chat.id !== chatId)
      if (this.activeChat?.id === chatId) {
        this.activeChat = this.chatList[0] || null
      }
      storage.saveChats(this.chatList)
    }
  }
}) 