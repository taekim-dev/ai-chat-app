import { vi } from 'vitest'

// Mock BroadcastChannel API
class MockBroadcastChannel {
  postMessage = vi.fn()
  close = vi.fn()
  onmessage: ((ev: MessageEvent) => void) | null = null
  name: string

  constructor(name: string) {
    this.name = name
  }
}

// Add BroadcastChannel to global
global.BroadcastChannel = MockBroadcastChannel as any

beforeEach(() => {
  vi.clearAllMocks()
})
