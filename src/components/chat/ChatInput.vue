<template>
  <div class="h-16 px-4 flex items-center border-t border-surface-200 bg-surface-50 flex-shrink-0">
    <form class="flex space-x-4 w-full" @submit.prevent="handleSubmit">
      <input
        v-model="message"
        type="text"
        placeholder="Type a message..."
        class="input flex-1"
        :disabled="disabled"
      />
      <button
        type="submit"
        class="btn"
        :class="[
          message.trim() ? 'btn-success' : 'btn-neutral',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
        :disabled="disabled || !message.trim()"
      >
        {{ isInputCoolingDown ? '...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  disabled: boolean
  isInputCoolingDown: boolean
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const message = ref('')

const handleSubmit = () => {
  const trimmedMessage = message.value.trim()
  if (!trimmedMessage || props.disabled) return
  emit('send', trimmedMessage)
  message.value = ''
}
</script> 