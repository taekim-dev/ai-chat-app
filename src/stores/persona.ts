import { defineStore } from 'pinia'
import type { Persona } from '@/types'

export const usePersonaStore = defineStore('persona', {
  state: () => ({
    personas: [
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
        id: 'chef',
        name: 'Master Chef',
        icon: '👨‍🍳',
        description: 'Guides you through recipes and cooking techniques'
      },
      {
        id: 'trainer',
        name: 'Fitness Trainer',
        icon: '💪',
        description: 'Helps you achieve your fitness goals with personalized workouts'
      },
      {
        id: 'mystery',
        name: 'Celebrity Chat',
        icon: '🌟',
        description: 'Chat with a surprise global celebrity - could be a sports star, musician, or other popular figure'
      }
    ] as Persona[]
  }),

  getters: {
    getPersonaById: (state) => {
      return (id: string) => state.personas.find(p => p.id === id)
    }
  }
}) 