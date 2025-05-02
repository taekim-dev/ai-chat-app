import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import NewChatView from '../NewChatView.vue'
import { useChatStore } from '@/stores/chat'
import { usePersonaStore } from '@/stores/persona'

// Mock storage and API dependencies
vi.mock('@/services/storage', () => ({
  storage: {
    loadChats: vi.fn(),
    saveChats: vi.fn()
  }
}))

vi.mock('@/services/db', () => ({
  db: {
    init: vi.fn()
  }
}))

vi.mock('@/services/api', () => ({
  sendMessage: vi.fn()
}))

describe('NewChatView', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/chat/:chatId?', name: 'chat', component: { template: '<div></div>' } },
      { path: '/new-chat', name: 'new-chat', component: NewChatView }
    ]
  })

  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/new-chat')
  })

  it('should create only one chat when clicking a persona', async () => {
    // Mount component with mocked store
    const wrapper = mount(NewChatView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false
          }),
          router
        ]
      }
    })

    // Get store instances
    const chatStore = useChatStore()
    const personaStore = usePersonaStore()
    const firstPersona = personaStore.personas[0]

    // Find and click the first persona button
    const buttons = await wrapper.findAll('button')
    await buttons[1].trigger('click') // First regular persona button

    // Wait for async operations
    await vi.waitFor(() => {
      expect(chatStore.chatList).toHaveLength(1)
      expect(chatStore.chatList[0].personaId).toBe(firstPersona.id)
      expect(router.currentRoute.value.path).toContain('/chat/')
      expect(router.currentRoute.value.params.chatId).toBe(chatStore.chatList[0].id)
    })

    // Verify no duplicate chats were created
    expect(chatStore.chatList).toHaveLength(1)
  })

  it('should not create duplicate chats on rapid clicks', async () => {
    const wrapper = mount(NewChatView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false
          }),
          router
        ]
      }
    })

    const chatStore = useChatStore()
    const buttons = await wrapper.findAll('button')

    // Simulate multiple rapid clicks
    await Promise.all([
      buttons[1].trigger('click'),
      buttons[1].trigger('click'),
      buttons[1].trigger('click')
    ])

    // Wait for all async operations
    await vi.waitFor(() => {
      expect(chatStore.chatList).toHaveLength(1)
      expect(router.currentRoute.value.path).toContain('/chat/')
    })

    // Verify only one chat was created
    expect(chatStore.chatList).toHaveLength(1)
  })
}) 