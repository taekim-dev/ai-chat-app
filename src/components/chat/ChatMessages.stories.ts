import type { Meta, StoryObj } from '@storybook/vue3'
import ChatMessages from './ChatMessages.vue'
import type { Message } from './ChatMessages.vue'

const meta = {
  title: 'Chat/ChatMessages',
  component: ChatMessages,
  tags: ['autodocs'],
  argTypes: {
    messages: { control: 'object' },
    isSending: { control: 'boolean' },
    error: { control: 'text' },
    canRetry: { control: 'boolean' },
    personaIcon: { control: 'text' },
    onRetry: { action: 'retry' }
  }
} satisfies Meta<typeof ChatMessages>

export default meta
type Story = StoryObj<typeof meta>

const defaultMessages: Message[] = [
  {
    id: '1',
    type: 'user',
    content: 'Hello there!',
    status: 'sent'
  },
  {
    id: '2',
    type: 'agent',
    content: 'Hi! How can I help you today?',
    status: 'sent'
  }
]

export const Default: Story = {
  args: {
    messages: defaultMessages,
    isSending: false,
    error: null,
    canRetry: false,
    personaIcon: '👨‍⚕️'
  }
}

export const WithTypingIndicator: Story = {
  args: {
    ...Default.args,
    isSending: true
  }
}

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Failed to send message. Please try again.',
    canRetry: true
  }
}

export const WithErrorMobile: Story = {
  args: {
    ...WithError.args
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
} 