<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            @click="$emit('update:modelValue', false)"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-error-500 text-white hover:bg-error-600 rounded-lg transition-colors"
            @click="confirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
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