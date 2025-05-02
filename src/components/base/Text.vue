<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'error';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body',
  weight: 'normal',
  color: 'default',
  align: 'left',
  truncate: false,
});

const classes = computed(() => {
  // Typography variants
  const variantClasses = {
    h1: ['text-2xl', 'font-semibold', 'leading-tight'],
    h2: ['text-xl', 'font-semibold', 'leading-tight'],
    h3: ['text-lg', 'font-medium', 'leading-snug'],
    h4: ['text-base', 'font-medium', 'leading-snug'],
    body: ['text-base', 'leading-normal'],
    caption: ['text-sm', 'leading-normal'],
  }[props.variant];

  // Font weights
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }[props.weight];

  // Text colors
  const colorClasses = {
    default: 'text-content-400',
    muted: 'text-content-100',
    primary: 'text-primary-600',
    success: 'text-success-700',
    error: 'text-error-700',
  }[props.color];

  // Text alignment
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[props.align];

  // Truncation
  const truncateClasses = props.truncate
    ? ['truncate', 'overflow-hidden', 'overflow-ellipsis']
    : [];

  return [
    ...variantClasses,
    weightClasses,
    colorClasses,
    alignClasses,
    ...truncateClasses,
  ];
});

// Map variants to HTML elements
const elementMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'span',
} as const;
</script>

<template>
  <component
    :is="elementMap[variant]"
    :class="classes"
  >
    <slot />
  </component>
</template> 