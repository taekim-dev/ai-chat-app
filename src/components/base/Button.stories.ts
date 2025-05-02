import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './Button.vue'

type ButtonStoryProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neutral' | 'success' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}

const meta = {
  title: 'Base/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'neutral', 'success', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} as Meta<any>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Primary Button</Button>',
  }),
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Secondary Button</Button>',
  }),
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Outline Button</Button>',
  }),
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Ghost Button</Button>',
  }),
}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Neutral Button</Button>',
  }),
}

export const Success: Story = {
  args: {
    variant: 'success',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Success Button</Button>',
  }),
}

export const Error: Story = {
  args: {
    variant: 'error',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Error Button</Button>',
  }),
}

export const Info: Story = {
  args: {
    variant: 'info',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Info Button</Button>',
  }),
}

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: '🔍',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Search</Button>',
  }),
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Loading...</Button>',
  }),
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Disabled</Button>',
  }),
}

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Full Width Button</Button>',
  }),
} 