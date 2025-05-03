import { computed } from 'vue'
import { usePersonaStore } from '@/stores/persona'
import type { Persona } from '@/types'

export function usePersona() {
  const personaStore = usePersonaStore()

  const getPersonaIcon = (personaId: string) => {
    return personaStore.getPersonaById(personaId)?.icon || '👤'
  }

  const getPersonaName = (personaId: string) => {
    return personaStore.getPersonaById(personaId)?.name || 'Unknown'
  }

  const regularPersonas = computed(() => {
    return personaStore.personas.filter(p => p.id !== 'mystery')
  })

  const celebrityPersona = computed(() => {
    return personaStore.personas.find(p => p.id === 'mystery')
  })

  const getPersonaById = (personaId: string): Persona | undefined => {
    return personaStore.getPersonaById(personaId)
  }

  return {
    getPersonaIcon,
    getPersonaName,
    regularPersonas,
    celebrityPersona,
    getPersonaById
  }
} 