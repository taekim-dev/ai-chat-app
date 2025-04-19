import { RATE_LIMIT_CONFIG } from '@/config'
import { ValidationError } from '@/utils/errors'

interface ChatLimit {
  lastRequestTime: number
  totalMessages: number
}

export interface RateLimitResponse {
  allowed: boolean
  reason?: string
  cooldownMs?: number  // Return remaining cooldown time for UI handling
}

export class RateLimiter {
  private limits: Map<string, ChatLimit> = new Map()
  private cleanupInterval: number | null = null

  constructor() {
    this.startCleanup()
  }

  private startCleanup(): void {
    // Clean up old entries periodically
    this.cleanupInterval = window.setInterval(() => {
      const now = Date.now()
      for (const [chatId, limit] of this.limits.entries()) {
        if (now - limit.lastRequestTime > RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS) {
          this.limits.delete(chatId)
        }
      }
    }, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS)
  }

  async checkRateLimit(chatId: string): Promise<RateLimitResponse> {
    if (!chatId) {
      throw new ValidationError('Chat ID is required')
    }

    let limit = this.limits.get(chatId)
    if (!limit) {
      limit = { lastRequestTime: 0, totalMessages: 0 }
      this.limits.set(chatId, limit)
    }

    const now = Date.now()
    const timeSinceLastRequest = now - limit.lastRequestTime

    // Check cooldown
    if (timeSinceLastRequest < RATE_LIMIT_CONFIG.COOLDOWN_MS) {
      return {
        allowed: false,
        cooldownMs: RATE_LIMIT_CONFIG.COOLDOWN_MS - timeSinceLastRequest
      }
    }

    // Check total messages
    if (limit.totalMessages >= RATE_LIMIT_CONFIG.MAX_MESSAGES_PER_CHAT) {
      return {
        allowed: false,
        reason: "You've reached the message limit for this chat. Please start a new chat to continue the conversation."
      }
    }

    // Update limits
    limit.lastRequestTime = now
    limit.totalMessages++
    return { allowed: true }
  }

  clearLimits(chatId: string): void {
    if (!chatId) {
      throw new ValidationError('Chat ID is required')
    }
    this.limits.delete(chatId)
  }

  destroy(): void {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.limits.clear()
  }
}

export const rateLimiter = new RateLimiter() 