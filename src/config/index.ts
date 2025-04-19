export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://ai-chat-serveless.vercel.app/api',
  TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  API_KEY: import.meta.env.VITE_API_KEY || ''
}

export const RATE_LIMIT_CONFIG = {
  COOLDOWN_MS: Number(import.meta.env.VITE_RATE_LIMIT_COOLDOWN) || 3000,
  MAX_MESSAGES_PER_CHAT: Number(import.meta.env.VITE_RATE_LIMIT_MAX_MESSAGES) || 30,
  CLEANUP_INTERVAL_MS: Number(import.meta.env.VITE_RATE_LIMIT_CLEANUP_INTERVAL) || 3600000
}

export const STORAGE_CONFIG = {
  DB_NAME: import.meta.env.VITE_DB_NAME || 'ai-chat-app',
  DB_VERSION: Number(import.meta.env.VITE_DB_VERSION) || 1,
  STORE_NAME: 'chats'
}

export const SYNC_CONFIG = {
  CHANNEL_NAME: import.meta.env.VITE_SYNC_CHANNEL || 'chat-sync',
  RECONNECT_DELAY_MS: Number(import.meta.env.VITE_SYNC_RECONNECT_DELAY) || 1000
}

export const CHAT_CONFIG = {
  MAX_CHATS: Number(import.meta.env.VITE_MAX_CHATS) || 5,
  MAX_RETRIES: Number(import.meta.env.VITE_MAX_RETRIES) || 3
} 