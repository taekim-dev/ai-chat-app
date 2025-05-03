import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { rateLimiter } from '@/services/rateLimiter'

export function useChat() {
  const chatStore = useChatStore()
  const isSending = ref(false)
  const isInputCoolingDown = ref(false)
  const cooldownTimer = ref<number | null>(null)

  const startCooldown = (cooldownMs: number) => {
    isInputCoolingDown.value = true
    if (cooldownTimer.value) {
      clearTimeout(cooldownTimer.value)
    }
    cooldownTimer.value = window.setTimeout(() => {
      isInputCoolingDown.value = false
    }, cooldownMs)
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || isSending.value) return

    isSending.value = true

    try {
      await chatStore.sendMessage(message)
      const rateLimit = await rateLimiter.checkRateLimit(chatStore.activeChat!.id)
      if (!rateLimit.allowed && rateLimit.cooldownMs) {
        startCooldown(rateLimit.cooldownMs)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      isSending.value = false
    }
  }

  const retryMessage = async () => {
    if (isSending.value) return

    try {
      isSending.value = true
      await chatStore.retryLastFailedMessage()
      const rateLimit = await rateLimiter.checkRateLimit(chatStore.activeChat!.id)
      if (!rateLimit.allowed && rateLimit.cooldownMs) {
        startCooldown(rateLimit.cooldownMs)
      }
    } catch (error) {
      console.error('Failed to retry message:', error)
    } finally {
      isSending.value = false
    }
  }

  return {
    isSending,
    isInputCoolingDown,
    sendMessage,
    retryMessage
  }
} 