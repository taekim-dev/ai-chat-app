import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimiter } from '../rateLimiter'
import { syncService } from '../sync'
import { NetworkError, ValidationError } from '@/utils/errors'
import { RATE_LIMIT_CONFIG } from '@/config'

describe('RateLimiter', () => {
  const chatId = 'test-chat-id'

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    rateLimiter.clearLimits(chatId)
  })

  it('should allow first message', async () => {
    const result = await rateLimiter.checkRateLimit(chatId)
    expect(result.allowed).toBe(true)
  })

  it('should enforce cooldown period', async () => {
    await rateLimiter.checkRateLimit(chatId)
    const result = await rateLimiter.checkRateLimit(chatId)
    expect(result.allowed).toBe(false)
    expect(result.cooldownMs).toBeDefined()
  })

  it('should enforce message limit', async () => {
    for (let i = 0; i < RATE_LIMIT_CONFIG.MAX_MESSAGES_PER_CHAT; i++) {
      vi.advanceTimersByTime(RATE_LIMIT_CONFIG.COOLDOWN_MS)
      await rateLimiter.checkRateLimit(chatId)
    }

    vi.advanceTimersByTime(RATE_LIMIT_CONFIG.COOLDOWN_MS)
    const result = await rateLimiter.checkRateLimit(chatId)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBeDefined()
  })

  it('should throw validation error for empty chatId', async () => {
    await expect(rateLimiter.checkRateLimit('')).rejects.toThrow(ValidationError)
  })
})

describe('SyncService', () => {
  beforeEach(() => {
    vi.stubGlobal('BroadcastChannel', class MockBroadcastChannel {
      constructor(public name: string) {}
      postMessage = vi.fn()
      close = vi.fn()
    })
  })

  afterEach(() => {
    syncService.disconnect()
  })

  it('should broadcast messages', () => {
    const testData = [{
      id: 'test-id',
      personaId: 'test-persona',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }]

    syncService.broadcast('test-event', testData)
    // Verify no errors thrown
  })

  it('should handle updates', () => {
    const callback = vi.fn()
    syncService.onUpdate(callback)

    const mockEvent = {
      data: {
        event: 'chats-updated',
        data: [{
          id: 'test-id',
          personaId: 'test-persona',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      }
    }

    // @ts-ignore - we know this exists from the mock
    syncService['channel'].onmessage(mockEvent)
    expect(callback).toHaveBeenCalled()
  })
}) 