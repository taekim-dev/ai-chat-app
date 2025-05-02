import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '@/views/ChatView.vue'
import { useChatStore } from '@/stores/chat'
import { rateLimiter } from '@/services/rateLimiter'

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock API service
vi.mock('@/services/api', () => ({
  sendMessage: vi.fn().mockResolvedValue({
    content: 'Test response',
    celebrity: undefined
  })
}))

// Mock storage service
vi.mock('@/services/storage', () => ({
  storage: {
    loadChats: vi.fn().mockResolvedValue([]),
    saveChats: vi.fn().mockResolvedValue(undefined)
  }
}))

// Mock db service
vi.mock('@/services/db', () => ({
  db: {
    init: vi.fn().mockResolvedValue(undefined),
    saveChats: vi.fn().mockResolvedValue(undefined),
    loadChats: vi.fn().mockResolvedValue([])
  }
}))

// Mock router since it's used in the component
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/chat/:chatId?', name: 'chat', component: ChatView },
    { path: '/new-chat', name: 'new-chat', component: {} }
  ]
})

type PersonaId = 'therapist' | 'tutor' | 'chef' | 'trainer' | 'mystery';

describe('ChatView Critical Paths', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Initialize the store
    const chatStore = useChatStore()
    await chatStore.initialize()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize chat with different personas', async () => {
    const chatStore = useChatStore()
    
    // Test with different personas
    const personas = [
      { 
        id: 'therapist' as PersonaId, 
        name: 'Therapist', 
        icon: '👨‍⚕️',
        description: 'A supportive listener who helps you explore thoughts and feelings'
      },
      { 
        id: 'tutor' as PersonaId, 
        name: 'Language Tutor', 
        icon: '👨‍🏫',
        description: 'Helps you learn and practice languages with personalized guidance'
      },
      { 
        id: 'chef' as PersonaId, 
        name: 'Master Chef', 
        icon: '👨‍🍳',
        description: 'Guides you through recipes and cooking techniques'
      },
      { 
        id: 'trainer' as PersonaId, 
        name: 'Fitness Trainer', 
        icon: '💪',
        description: 'Helps you achieve your fitness goals with personalized workouts'
      },
      { 
        id: 'mystery' as PersonaId, 
        name: 'Celebrity Chat', 
        icon: '🌟',
        description: 'Chat with a surprise global celebrity - could be a sports star, musician, or other popular figure'
      }
    ]

    const welcomeMessages: Record<PersonaId, string> = {
      therapist: 'professional therapist',
      tutor: 'language tutor',
      chef: 'master chef',
      trainer: 'fitness trainer',
      mystery: 'celebrity'
    }

    for (const persona of personas) {
      const testChat = await chatStore.createChat(persona)
      
      const wrapper = mount(ChatView, {
        global: {
          plugins: [router],
          stubs: {
            ChatSidebar: true,
            ChatMessages: true,
            ChatInput: true
          }
        }
      })

      await router.push({ name: 'chat', params: { chatId: testChat.id } })
      await wrapper.vm.$nextTick()

      // Verify active chat is set with correct persona
      expect(chatStore.activeChat?.id).toBe(testChat.id)
      expect(chatStore.activeChat?.personaId).toBe(persona.id)
      
      // Verify welcome message based on persona
      const welcomeMessage = JSON.parse(chatStore.activeChat?.messages[0].content || '{}')
      expect(welcomeMessage.content.toLowerCase()).toContain(welcomeMessages[persona.id])
      
      wrapper.unmount()
    }
  })

  it('should handle message sending with rate limiting', async () => {
    const chatStore = useChatStore()
    const testChat = await chatStore.createChat({
      id: 'therapist',
      name: 'Therapist',
      icon: '👨‍⚕️',
      description: 'A supportive listener who helps you explore thoughts and feelings'
    })

    // Mock rate limiter and API response
    vi.spyOn(rateLimiter, 'checkRateLimit').mockResolvedValue({
      allowed: true,
      cooldownMs: 0
    })

    const wrapper = mount(ChatView, {
      global: {
        plugins: [router],
        stubs: {
          ChatSidebar: true,
          ChatMessages: true,
          ChatInput: false // Don't stub ChatInput to test emit
        }
      }
    })

    await router.push({ name: 'chat', params: { chatId: testChat.id } })
    await wrapper.vm.$nextTick()
    
    // Get initial message count and store it
    const initialCount = chatStore.activeChat?.messages.length || 0
    
    // Simulate message send via ChatInput emit
    await wrapper.findComponent({ name: 'ChatInput' }).vm.$emit('send', 'Hello')
    
    // Wait for all promises to resolve
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Verify message was added to the chat
    expect(chatStore.activeChat?.messages.length).toBe(initialCount + 2) // Account for both user message and AI response
    expect(rateLimiter.checkRateLimit).toHaveBeenCalledWith(testChat.id)
    
    wrapper.unmount()
  })

  it('should maintain chat list limit of 5', async () => {
    const chatStore = useChatStore()
    const persona = {
      id: 'therapist',
      name: 'Therapist',
      icon: '👨‍⚕️',
      description: 'A supportive listener who helps you explore thoughts and feelings'
    }
    
    // Create 6 chats
    for (let i = 0; i < 6; i++) {
      await chatStore.createChat(persona)
    }

    // Verify only 5 chats are kept
    expect(chatStore.chatList.length).toBe(5)
  })

  it('should handle mobile sidebar toggle', async () => {
    const wrapper = mount(ChatView, {
      global: {
        plugins: [router],
        stubs: {
          ChatMessages: true,
          ChatInput: true,
          ChatSidebar: false // Don't stub sidebar to test toggle
        }
      }
    })

    // Wait for component to mount
    await wrapper.vm.$nextTick()

    // Find and click hamburger button
    const hamburgerButton = wrapper.find('button.md\\:hidden')
    expect(hamburgerButton.exists()).toBe(true)
    await hamburgerButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Verify overlay appears
    const overlay = wrapper.find('.bg-neutral-900.bg-opacity-50')
    expect(overlay.exists()).toBe(true)
    
    // Click overlay to close
    await overlay.trigger('click')
    await wrapper.vm.$nextTick()

    // Verify overlay is gone
    expect(wrapper.find('.bg-neutral-900.bg-opacity-50').exists()).toBe(false)
    
    wrapper.unmount()
  })
}) 