<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  required: false,
  fullWidth: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputClasses = computed(() => {
  const baseClasses = [
    'rounded-md',
    'border',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500/20',
    'focus:border-primary-500',
    'disabled:bg-surface-200',
    'disabled:cursor-not-allowed',
    'placeholder:text-content-50',
  ];

  // Size variations
  const sizeClasses = {
    sm: ['px-2', 'py-1', 'text-sm'],
    md: ['px-3', 'py-2', 'text-base'],
    lg: ['px-4', 'py-3', 'text-lg'],
  }[props.size];

  // State variations
  const stateClasses = props.error
    ? ['border-error-500', 'bg-error-50']
    : ['border-surface-300', 'bg-surface-50'];

  // Width variation
  const widthClass = props.fullWidth ? 'w-full' : 'w-auto';

  return [...baseClasses, ...sizeClasses, ...stateClasses, widthClass];
});

const labelClasses = computed(() => [
  'block',
  'mb-1',
  'font-medium',
  'text-content-300',
  props.error ? 'text-error-700' : 'text-content-300',
  props.disabled ? 'opacity-50' : '',
]);
</script>

<template>
  <div :class="fullWidth ? 'w-full' : 'w-auto'">
    <label v-if="label" :for="label" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>
    
    <input
      :id="label"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      :class="inputClasses"
      :aria-disabled="disabled"
      :aria-required="required"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${label}-error` : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    
    <p v-if="error" :id="`${label}-error`" class="mt-1 text-sm text-error-700">
      {{ error }}
    </p>
  </div>
</template> 