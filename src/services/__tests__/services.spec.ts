import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimiter } from '../rateLimiter'
import { syncService, SyncService } from '../sync'
import { ValidationError } from '@/utils/errors'
import { RATE_LIMIT_CONFIG } from '@/config'
import { v4 as uuidv4 } from 'uuid'

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
  let mockChannel: any

  beforeEach(() => {
    mockChannel = {
      postMessage: vi.fn(),
      close: vi.fn(),
      onmessage: null
    }

    vi.stubGlobal(
      'BroadcastChannel',
      class {
        constructor() {
          return mockChannel
        }
      }
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    syncService.disconnect()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should broadcast messages', async () => {
    const testData = [
      {
        id: uuidv4(),
        personaId: 'test-persona',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Create a new instance to use our fresh mock
    const newSyncService = new SyncService()
    newSyncService.broadcast('test-event', testData)

    // Wait for the setTimeout in broadcast
    await vi.runAllTimersAsync()

    expect(mockChannel.postMessage).toHaveBeenCalledTimes(1)
  })

  it('should handle updates', async () => {
    const callback = vi.fn()
    const newSyncService = new SyncService()
    newSyncService.onUpdate(callback)

    const now = new Date()
    const mockEventData = {
      event: 'chats-updated',
      data: [
        {
          id: uuidv4(),
          personaId: 'test-persona',
          messages: [
            {
              id: uuidv4(),
              type: 'user',
              content: 'test message',
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              status: 'sent'
            }
          ],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        }
      ]
    }

    // Create a proper MessageEvent
    const mockEvent = new MessageEvent('message', {
      data: mockEventData
    })

    // Trigger the onmessage handler
    if (mockChannel.onmessage) {
      mockChannel.onmessage(mockEvent)
      await vi.runAllTimersAsync()
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            personaId: 'test-persona',
            messages: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                type: 'user',
                content: 'test message',
                status: 'sent'
              })
            ])
          })
        ])
      )
    } else {
      throw new Error('onmessage handler not set')
    }
  })
})
