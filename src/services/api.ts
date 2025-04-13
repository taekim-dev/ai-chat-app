import type { Message } from '@/types'
import { v4 as uuidv4 } from 'uuid'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock AI responses based on persona
const mockResponses: Record<string, string[]> = {
  'therapist': [
    "How does that make you feel?",
    "Can you tell me more about that?",
    "It sounds like this is important to you.",
    "What thoughts come up when you think about this?"
  ],
  'default': [
    "That's interesting, please continue.",
    "I understand what you're saying.",
    "Could you elaborate on that?"
  ]
}

export const api = {
  async sendMessage(message: Omit<Message, 'id' | 'status' | 'type'>, personaId: string): Promise<Message> {
    // Simulate network delay
    await delay(1000)

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Failed to send message")
    }

    // Get responses for the specific persona, or use default if not found
    const responses = mockResponses[personaId] || mockResponses.default
    const response = responses[Math.floor(Math.random() * responses.length)]

    return {
      id: uuidv4(),
      content: response,
      type: 'agent',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
} 