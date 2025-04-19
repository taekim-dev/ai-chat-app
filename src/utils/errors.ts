export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', details)
    this.name = 'NetworkError'
  }
}

export class StorageError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_ERROR', details)
    this.name = 'StorageError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function handleError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', error)
  }
  
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', error)
} 