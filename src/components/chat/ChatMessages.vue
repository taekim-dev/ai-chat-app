<template>
  <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="[
        'message flex',
        message.type === 'user' ? 'justify-end' : 'justify-start',
        message.status === 'error' ? 'message-error' : '',
        message.status === 'pending' ? 'message-pending' : ''
      ]"
    >
      <div
        :class="[
          'rounded-2xl px-4 py-3 max-w-[85%] break-words shadow-sm',
          message.type === 'user'
            ? 'bg-primary-500 text-white rounded-tr-none'
            : 'bg-surface-50 text-content-400 rounded-tl-none border border-surface-200',
          message.type === 'agent' ? 'typing-animation' : ''
        ]"
        v-html="formatMessageHtml(message)"
      ></div>
    </div>

    <div v-if="isSending" class="flex justify-start">
      <div class="rounded-2xl px-4 py-3 bg-surface-50 text-content-400 border border-surface-200 rounded-tl-none shadow-sm">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">{{ personaIcon }}</span>
          <div class="flex space-x-1">
            <div
              v-for="i in 3"
              :key="i"
              class="w-2 h-2 bg-surface-300 rounded-full animate-bounce"
              :style="{ 'animation-delay': `${(i - 1) * 0.2}s` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="error"
      class="max-w-3xl mx-auto p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div class="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm">{{ error }}</span>
      </div>
      <Button
        v-if="canRetry"
        variant="error"
        size="sm"
        class="w-full sm:w-auto"
        @click="$emit('retry')"
      >
        Retry
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import Button from '@/components/base/Button.vue'

interface MessageContent {
  content: string
}

export interface Message {
  id: string
  type: 'user' | 'agent'
  content: string | MessageContent
  status?: 'error' | 'pending' | 'sent'
  createdAt?: Date
  updatedAt?: Date
}

const props = defineProps<{
  messages: Message[]
  isSending: boolean
  error?: string | null
  canRetry: boolean
  personaIcon: string
}>()

defineEmits<{
  (e: 'retry'): void
}>()

const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(scrollToBottom)
watch(() => props.messages, scrollToBottom, { deep: true })

const formatMessageHtml = (message: Message): string => {
  let text = ''
  if (typeof message.content === 'string') {
    try {
      const parsed = JSON.parse(message.content)
      text = parsed.content || message.content
    } catch {
      text = message.content
    }
  } else {
    text = message.content.content || ''
  }

  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')

  const paragraphs = text.split('\n\n')
  return `<p class="${message.type === 'agent' ? 'typing-animation' : ''}">${paragraphs
    .map(paragraph => paragraph.replace(/\n/g, '<br>'))
    .join('</p><p>')}</p>`
}
</script>

<style scoped>
.typing-animation {
  overflow: hidden;
  animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: pre-wrap;
}

.message {
  animation: fadeInMessage 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transform-origin: top;
  will-change: transform, opacity;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInMessage {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.retry-button:focus {
  @apply outline-2 outline-offset-2 outline-primary-500;
}
</style> 