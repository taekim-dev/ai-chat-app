import type { Chat } from '@/types'

const DB_NAME = 'ai-chat-app'
const DB_VERSION = 1
const STORE_NAME = 'chats'

export class IndexedDBService {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }

  private ensureDbConnection(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.')
    }
    return this.db
  }

  async saveChats(chats: Chat[]): Promise<void> {
    const db = this.ensureDbConnection()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      // Clear existing data
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => {
        // Add all chats
        chats.forEach(chat => {
          store.add({
            ...chat,
            createdAt: chat.createdAt.toISOString(),
            updatedAt: chat.updatedAt.toISOString(),
            messages: chat.messages.map(msg => ({
              ...msg,
              createdAt: msg.createdAt.toISOString(),
              updatedAt: msg.updatedAt.toISOString()
            }))
          })
        })
      }

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async loadChats(): Promise<Chat[]> {
    const db = this.ensureDbConnection()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const chats = request.result.map(chat => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
            updatedAt: new Date(msg.updatedAt)
          }))
        }))
        resolve(chats)
      }

      request.onerror = () => reject(request.error)
    })
  }

  async clearChats(): Promise<void> {
    const db = this.ensureDbConnection()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const db = new IndexedDBService() 