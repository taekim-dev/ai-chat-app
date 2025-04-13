import { defineStore } from 'pinia'
import type { Persona } from '@/types'

export const usePersonaStore = defineStore('persona', {
  state: () => ({
    personas: [
      {
        id: 'therapist',
        name: 'Therapist',
        icon: '🔵' // We'll use emoji for now, can be replaced with actual icons
      },
      {
        id: 'persona-b',
        name: 'B',
        icon: '🟢'
      },
      {
        id: 'persona-c',
        name: 'C',
        icon: '🟡'
      }
    ] as Persona[]
  }),

  getters: {
    getPersonaById: (state) => {
      return (id: string) => state.personas.find(p => p.id === id)
    }
  }
}) 