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
  private readonly COOLDOWN_MS = 3000 // 3 seconds
  private readonly MAX_MESSAGES = 30

  async checkRateLimit(chatId: string): Promise<RateLimitResponse> {
    let limit = this.limits.get(chatId)
    if (!limit) {
      limit = { lastRequestTime: 0, totalMessages: 0 }
      this.limits.set(chatId, limit)
    }

    const now = Date.now()
    const timeSinceLastRequest = now - limit.lastRequestTime

    // Check cooldown
    if (timeSinceLastRequest < this.COOLDOWN_MS) {
      return {
        allowed: false,
        cooldownMs: this.COOLDOWN_MS - timeSinceLastRequest
      }
    }

    // Check total messages
    if (limit.totalMessages >= this.MAX_MESSAGES) {
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
    this.limits.delete(chatId)
  }
}

export const rateLimiter = new RateLimiter() 