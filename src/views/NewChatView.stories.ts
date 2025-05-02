import type { Meta, StoryObj } from '@storybook/vue3'
import { createPinia, setActivePinia } from 'pinia'
import NewChatView from './NewChatView.vue'
import { usePersonaStore } from '@/stores/persona'
import { useChatStore } from '@/stores/chat'
import type { Persona } from '@/types'

// Initialize Pinia for stories
setActivePinia(createPinia())

// Setup mock data
const setupMockStores = () => {
  const personaStore = usePersonaStore()
  const chatStore = useChatStore()

  // Mock personas
  const mockPersonas: Persona[] = [
    { 
      id: 'therapist', 
      name: 'Therapist', 
      icon: '👨‍⚕️',
      description: 'A supportive listener who helps you explore thoughts and feelings'
    },
    { 
      id: 'tutor', 
      name: 'Language Tutor', 
      icon: '👨‍🏫',
      description: 'Helps you learn and practice languages with personalized guidance'
    },
    { 
      id: 'mystery', 
      name: 'Celebrity Chat', 
      icon: '🌟',
      description: 'Chat with a surprise global celebrity - could be a sports star, musician, or other popular figure'
    }
  ]

  // Set mock data
  personaStore.$patch({ personas: mockPersonas })
  
  return { personaStore, chatStore }
}

export default {
  title: 'Views/NewChatView',
  component: NewChatView,
  tags: ['autodocs'],
  decorators: [
    () => {
      setupMockStores()
      return { template: '<div class="min-h-[600px]"><story /></div>' }
    }
  ],
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<typeof NewChatView>

type Story = StoryObj<typeof NewChatView>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  }
}

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    }
  }
} 