export interface AIConfig {
  rateLimit: number
  apiKey: string
  endpoint: string
  maxRetries: number
}

export interface RequestOptions {
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AIResponse {
  text: string
  confidence: number
  metadata: Record<string, any>
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface CategoryRule {
  category: Category
  evaluate: (input: any) => Promise<number>
}

export interface Context {
  updateState: (state: any) => void
  getState: () => any
}

// Add some utility types for better type safety
export type ProcessorFunction = (input: any) => Promise<any>

export interface ProcessingError extends Error {
  stage?: string
  input?: unknown
}
