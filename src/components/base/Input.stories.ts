import type { Meta, StoryObj } from '@storybook/vue3'
import Input from './Input.vue'

const meta = {
  title: 'Base/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} as Meta<any>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: '',
    label: 'Default Input',
    placeholder: 'Enter text...',
  },
}

export const Password: Story = {
  args: {
    modelValue: '',
    label: 'Password Input',
    type: 'password',
    placeholder: 'Enter password...',
  },
}

export const Email: Story = {
  args: {
    modelValue: '',
    label: 'Email Input',
    type: 'email',
    placeholder: 'Enter email...',
  },
}

export const Number: Story = {
  args: {
    modelValue: '',
    label: 'Number Input',
    type: 'number',
    placeholder: 'Enter number...',
  },
}

export const WithError: Story = {
  args: {
    modelValue: '',
    label: 'Error Input',
    error: 'This field is required',
  },
}

export const Disabled: Story = {
  args: {
    modelValue: '',
    label: 'Disabled Input',
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    modelValue: '',
    label: 'Required Input',
    required: true,
  },
}

export const FullWidth: Story = {
  args: {
    modelValue: '',
    label: 'Full Width Input',
    fullWidth: true,
  },
}

export const Small: Story = {
  args: {
    modelValue: '',
    label: 'Small Input',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    modelValue: '',
    label: 'Large Input',
    size: 'lg',
  },
} 