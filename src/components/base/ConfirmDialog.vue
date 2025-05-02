<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <Button
            variant="neutral"
            @click="$emit('update:modelValue', false)"
          >
            Cancel
          </Button>
          <Button
            variant="error"
            @click="confirm"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Button from './Button.vue'

defineProps<{
  modelValue: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script> 