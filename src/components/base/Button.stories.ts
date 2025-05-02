import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './Button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Base/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'The visual style of the button',
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'neutral', 'success', 'error', 'info']
    },
    size: {
      description: 'The size of the button',
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    loading: {
      description: 'Whether the button is in a loading state',
      control: 'boolean'
    },
    disabled: {
      description: 'Whether the button is disabled',
      control: 'boolean'
    },
    fullWidth: {
      description: 'Whether the button should take up the full width of its container',
      control: 'boolean'
    }
  }
} as Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'primary'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Primary Button</Button>'
  })
}

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Secondary Button</Button>'
  })
}

export const Success: Story = {
  args: {
    variant: 'success'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Success Button</Button>'
  })
}

export const Error: Story = {
  args: {
    variant: 'error'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Error Button</Button>'
  })
}

export const Info: Story = {
  args: {
    variant: 'info'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Info Button</Button>'
  })
}

export const Small: Story = {
  args: {
    size: 'sm'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Small Button</Button>'
  })
}

export const Medium: Story = {
  args: {
    size: 'md'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Medium Button</Button>'
  })
}

export const Large: Story = {
  args: {
    size: 'lg'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Large Button</Button>'
  })
} 