import type { Meta, StoryObj } from '@storybook/vue3'
import { createPinia, setActivePinia } from 'pinia'
import ChatSidebar from './ChatSidebar.vue'
import { useChatStore } from '@/stores/chat'
import { usePersonaStore } from '@/stores/persona'
import type { Chat, Persona } from '@/types'

// Initialize Pinia for stories
setActivePinia(createPinia())

// Setup mock data
const setupMockStores = () => {
  const chatStore = useChatStore()
  const personaStore = usePersonaStore()

  // Mock personas
  const mockPersonas: Persona[] = [
    { 
      id: 'therapist', 
      name: 'Therapist', 
      icon: '👨‍⚕️',
      description: 'A supportive listener who helps you explore thoughts and feelings'
    },
    { 
      id: 'coach', 
      name: 'Life Coach', 
      icon: '🏃‍♂️',
      description: 'Helps you achieve your life goals with actionable advice'
    }
  ]

  // Mock chats
  const mockChats: Chat[] = [
    { 
      id: 'chat1', 
      personaId: 'therapist', 
      messages: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    { 
      id: 'chat2', 
      personaId: 'coach', 
      messages: [],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ]

  // Set mock data
  personaStore.$patch({ personas: mockPersonas })
  chatStore.$patch({ chatList: mockChats })
  
  return { chatStore, personaStore }
}

export default {
  title: 'Chat/ChatSidebar',
  component: ChatSidebar,
  tags: ['autodocs'],
  decorators: [
    () => {
      setupMockStores()
      return { template: '<div class="h-screen"><story /></div>' }
    }
  ]
} as Meta<typeof ChatSidebar>

type Story = StoryObj<typeof ChatSidebar>

export const Default: Story = {
  args: {
    modelValue: true
  }
}

export const WithActiveChat: Story = {
  args: {
    modelValue: true
  },
  play: async () => {
    const chatStore = useChatStore()
    chatStore.setActiveChat('chat1')
  }
}

export const Closed: Story = {
  args: {
    modelValue: false
  }
}

export const Mobile: Story = {
  args: {
    modelValue: true
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
} 