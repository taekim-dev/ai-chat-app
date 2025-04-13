import { describe, it, expect, beforeEach, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../ChatView.vue'
import { useChatStore } from '@/stores/chat'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: ChatView }]
})

describe('ChatView', () => {
  beforeEach(() => {
    router.push('/')
  })

  it('displays empty state when no active chat', () => {
    const wrapper = mount(ChatView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vitest.fn
          }),
          router
        ]
      }
    })

    expect(wrapper.text()).toContain('Select a chat or start a new conversation')
  })

  it('displays chat messages when active chat exists', async () => {
    const wrapper = mount(ChatView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vitest.fn,
            initialState: {
              chat: {
                activeChat: {
                  id: 'test-chat',
                  personaId: 'test-persona',
                  messages: [
                    {
                      id: '1',
                      type: 'user',
                      content: 'Hello',
                      status: 'sent',
                      createdAt: new Date(),
                      updatedAt: new Date()
                    },
                    {
                      id: '2',
                      type: 'agent',
                      content: 'Hi there!',
                      status: 'sent',
                      createdAt: new Date(),
                      updatedAt: new Date()
                    }
                  ],
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              },
              persona: {
                personas: [
                  {
                    id: 'test-persona',
                    name: 'Test',
                    icon: '🤖'
                  }
                ]
              }
            }
          }),
          router
        ]
      }
    })

    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('Hi there!')
  })

  it('sends a message when form is submitted', async () => {
    const wrapper = mount(ChatView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vitest.fn,
            initialState: {
              chat: {
                activeChat: {
                  id: 'test-chat',
                  personaId: 'test-persona',
                  messages: [],
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              }
            }
          }),
          router
        ]
      }
    })

    const store = useChatStore()
    const input = wrapper.find('input[type="text"]')
    await input.setValue('Hello')
    await wrapper.find('form').trigger('submit')

    expect(store.sendMessage).toHaveBeenCalledWith('Hello')
  })
}) 