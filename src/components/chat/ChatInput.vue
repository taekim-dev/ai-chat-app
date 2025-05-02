<template>
  <div class="h-16 px-4 flex items-center border-t border-surface-200 bg-surface-50 flex-shrink-0">
    <form class="flex space-x-4 w-full" @submit.prevent="handleSubmit">
      <Input
        v-model="message"
        type="text"
        placeholder="Type a message..."
        :disabled="disabled"
        fullWidth
      />
      <Button
        type="submit"
        :variant="message.trim() ? 'success' : 'neutral'"
        :disabled="disabled || !message.trim()"
      >
        {{ isInputCoolingDown ? '...' : 'Send' }}
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/base/Input.vue'
import Button from '@/components/base/Button.vue'

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