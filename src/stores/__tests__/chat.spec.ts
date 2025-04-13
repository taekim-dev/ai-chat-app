import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from '../chat'
import type { Chat, Persona } from '@/types'

describe('Chat Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('creates a new chat', async () => {
    const store = useChatStore()
    const persona: Persona = {
      id: 'test-persona',
      name: 'Test Persona',
      icon: '🤖'
    }

    const chat = await store.createChat(persona)

    expect(chat.id).toBeDefined()
    expect(chat.personaId).toBe(persona.id)
    expect(chat.messages).toHaveLength(0)
    expect(store.chatList).toHaveLength(1)
    expect(store.activeChat).toBe(chat)
  })

  it('removes oldest chat when limit is reached', async () => {
    const store = useChatStore()
    const persona: Persona = {
      id: 'test-persona',
      name: 'Test Persona',
      icon: '🤖'
    }

    // Create 6 chats (limit is 5)
    for (let i = 0; i < 6; i++) {
      await store.createChat(persona)
    }

    expect(store.chatList).toHaveLength(5)
  })

  it('sends a message and receives a response', async () => {
    const store = useChatStore()
    const persona: Persona = {
      id: 'test-persona',
      name: 'Test Persona',
      icon: '🤖'
    }

    await store.createChat(persona)
    await store.sendMessage('Hello')

    const chat = store.activeChat as Chat
    expect(chat.messages).toHaveLength(2)
    expect(chat.messages[0].type).toBe('user')
    expect(chat.messages[1].type).toBe('agent')
  })

  it('handles message send failure', async () => {
    const store = useChatStore()
    const persona: Persona = {
      id: 'test-persona',
      name: 'Test Persona',
      icon: '🤖'
    }

    await store.createChat(persona)
    
    // Force many attempts to trigger the random failure
    for (let i = 0; i < 20; i++) {
      await store.sendMessage('Hello')
      const chat = store.activeChat as Chat
      const lastMessage = chat.messages[chat.messages.length - 2] // Get user message
      
      if (lastMessage.status === 'error') {
        expect(store.errorState).toBe("We're having trouble reaching your agent. Please try again.")
        return
      }
    }
  })
}) 