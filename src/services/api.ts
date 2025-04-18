import type { Message } from '@/types'

const API_URL = 'https://ai-chat-serveless.vercel.app/api/chat'

interface ApiResponse {
  content: string
  celebrity?: string
}

export async function sendMessage(
  message: string, 
  personaId: string,
  celebrityId?: string
): Promise<ApiResponse> {
  try {
    console.log('Sending request to:', API_URL)
    console.log('Request payload:', { message, personaId, celebrityId })
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        personaId,
        celebrityId
      })
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers))

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error response:', errorData)
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Response data:', data)
    return data.reply
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
} 