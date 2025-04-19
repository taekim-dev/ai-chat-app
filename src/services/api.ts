import type { Message } from '@/types'
import { API_CONFIG } from '@/config'
import { NetworkError } from '@/utils/errors'
import { validateApiResponse } from '@/utils/validation'

interface ApiResponse {
  content: string
  celebrity?: string
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export async function sendMessage(
  message: string, 
  personaId: string,
  celebrityId?: string,
  retryCount = 0
): Promise<ApiResponse> {
  try {
    console.log('Sending request to:', `${API_CONFIG.BASE_URL}/chat`)
    console.log('Request payload:', { message, personaId, celebrityId })
    
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'X-App-Origin': window.location.origin
        },
        body: JSON.stringify({
          message,
          personaId,
          celebrityId
        })
      },
      API_CONFIG.TIMEOUT_MS
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error response:', errorData)
      throw new NetworkError(
        `Network response was not ok: ${response.status} ${response.statusText}`,
        errorData
      )
    }

    const data = await response.json()
    console.log('Response data:', data)
    
    // Validate the response data
    return validateApiResponse(data.reply)
  } catch (error) {
    console.error('Error sending message:', error)
    
    // Retry logic for network errors
    if (error instanceof NetworkError && retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      console.log(`Retrying request (attempt ${retryCount + 1})...`)
      return sendMessage(message, personaId, celebrityId, retryCount + 1)
    }
    
    throw error
  }
} 