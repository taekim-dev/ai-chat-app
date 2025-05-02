<template>
  <button
    :class="[
      // Base styles
      'inline-flex items-center justify-center',
      'transition-colors duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Size variations
      sizeClasses[size],
      
      // Variant styles
      variantClasses[variant],
      
      // Full width option
      { 'w-full': fullWidth },
      
      className
    ]"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
    
    <!-- Icon (if provided) -->
    <span v-if="icon && !loading" class="mr-2">
      {{ icon }}
    </span>
    
    <!-- Button text -->
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neutral' | 'success' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  icon: '',
  loading: false,
  disabled: false,
  fullWidth: false,
  className: ''
})

// Size variations
const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-sm',
  md: 'px-4 py-2 text-base rounded-md',
  lg: 'px-6 py-3 text-lg rounded-lg'
}

// Variant styles
const variantClasses = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
  secondary: 'bg-surface-200 text-content-300 hover:bg-surface-300 focus:ring-surface-400',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
  neutral: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus:ring-neutral-400',
  success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500',
  error: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
  info: 'bg-info-500 text-white hover:bg-info-600 focus:ring-info-500'
}
</script> 