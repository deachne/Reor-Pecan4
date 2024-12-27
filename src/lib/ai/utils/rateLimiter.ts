export class RateLimiter {
  private tokens: number

  private maxTokens: number

  private lastRefill: number

  private refillRate: number

  constructor(tokensPerSecond: number) {
    this.maxTokens = tokensPerSecond
    this.tokens = tokensPerSecond
    this.lastRefill = Date.now()
    this.refillRate = 1000 / tokensPerSecond // milliseconds per token
  }

  async waitForToken(): Promise<void> {
    this.refillTokens()

    if (this.tokens <= 0) {
      const waitTime = this.refillRate
      await new Promise((resolve) => setTimeout(resolve, waitTime))
      this.refillTokens()
    }

    this.tokens--
  }

  private refillTokens(): void {
    const now = Date.now()
    const timePassed = now - this.lastRefill
    const newTokens = Math.floor(timePassed / this.refillRate)

    if (newTokens > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + newTokens)
      this.lastRefill = now
    }
  }
}
