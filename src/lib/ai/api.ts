import { RateLimiter } from './utils/rateLimiter'
import { AIConfig, RequestOptions, AIResponse } from './types'

export class AIApiService {
  private rateLimiter: RateLimiter

  private cache: Map<string, any>

  private endpoint: string

  private apiKey: string

  constructor(config: AIConfig) {
    this.rateLimiter = new RateLimiter(config.rateLimit)
    this.cache = new Map()
    this.endpoint = config.endpoint
    this.apiKey = config.apiKey
  }

  /**
   * Handles AI API calls with proper error handling and caching
   * @param prompt The input prompt
   * @param options Request options
   * @returns Promise with AI response
   */
  async processRequest(prompt: string, options: RequestOptions): Promise<AIResponse> {
    try {
      const cacheKey = this.generateCacheKey(prompt, options)

      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)
      }

      await this.rateLimiter.waitForToken()

      const response = await this.makeApiCall(prompt, options)
      this.cache.set(cacheKey, response)

      return response
    } catch (error) {
      console.error('AI API Error:', error)
      return this.handleFailover(prompt, options)
    }
  }

  private async handleFailover(prompt: string, options: RequestOptions): Promise<AIResponse> {
    // Implement fallback logic here
    return this.getFallbackResponse(prompt)
  }

  private generateCacheKey(prompt: string, options: RequestOptions): string {
    return `${prompt}-${JSON.stringify(options)}`
  }

  private async makeApiCall(prompt: string, options: RequestOptions): Promise<AIResponse> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      text: data.text,
      confidence: data.confidence || 1.0,
      metadata: data.metadata || {},
    }
  }

  private getFallbackResponse(prompt: string): AIResponse {
    return {
      text: "I apologize, but I'm unable to process your request at the moment.",
      confidence: 0.1,
      metadata: {
        fallback: true,
        originalPrompt: prompt,
      },
    }
  }
}
