import { z } from 'zod'
import type { Message, Chat } from '@/types'
import { ValidationError } from './errors'

export const MessageSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['user', 'agent']),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['sent', 'pending', 'error'])
})

export const ChatSchema = z.object({
  id: z.string().uuid(),
  personaId: z.string(),
  messages: z.array(MessageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  celebrityId: z.string().optional()
})

export function validateMessage(data: unknown): Message {
  try {
    return MessageSchema.parse(data)
  } catch (error) {
    throw new ValidationError('Invalid message data', error)
  }
}

export function validateChat(data: unknown): Chat {
  try {
    return ChatSchema.parse(data)
  } catch (error) {
    throw new ValidationError('Invalid chat data', error)
  }
}

export function validateApiResponse(data: unknown): { content: string; celebrity?: string } {
  const ApiResponseSchema = z.object({
    content: z.string(),
    celebrity: z.string().optional()
  })

  try {
    return ApiResponseSchema.parse(data)
  } catch (error) {
    throw new ValidationError('Invalid API response', error)
  }
}
