<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  padding: 'md',
  radius: 'md',
  hoverable: false,
  clickable: false,
});

const classes = computed(() => {
  // Base classes
  const baseClasses = ['overflow-hidden'];

  // Variant styles
  const variantClasses = {
    elevated: [
      'bg-surface-50',
      'shadow-md',
      'border',
      'border-surface-200',
    ],
    outlined: [
      'bg-surface-50',
      'border',
      'border-surface-300',
    ],
    filled: [
      'bg-surface-100',
    ],
  }[props.variant];

  // Padding variations
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }[props.padding];

  // Border radius variations
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
  }[props.radius];

  // Interactive states
  const interactiveClasses = [
    props.hoverable && 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
    props.clickable && 'cursor-pointer active:scale-[0.98] transition-transform',
  ].filter(Boolean);

  return [
    ...baseClasses,
    ...variantClasses,
    paddingClasses,
    radiusClasses,
    ...interactiveClasses,
  ];
});
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template> 