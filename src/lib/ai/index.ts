import { AIConfig } from './types'
import { AIApiService } from './api'
import { ContextManager } from './context'
import { AIPipeline } from './pipeline'
import { SmartCategorizer } from './categorization'

if (!process.env.AI_API_KEY || !process.env.AI_ENDPOINT) {
  throw new Error('Missing required environment variables: AI_API_KEY and AI_ENDPOINT must be set')
}

const aiConfig: AIConfig = {
  rateLimit: 10,
  apiKey: process.env.AI_API_KEY,
  endpoint: process.env.AI_ENDPOINT,
  maxRetries: 3,
}

const apiService = new AIApiService(aiConfig)
const contextManager = new ContextManager()
const pipeline = new AIPipeline({
  updateState: contextManager.updateContext.bind(contextManager),
  getState: () => contextManager.getRelevantContext(''),
})
const categorizer = new SmartCategorizer()

export { apiService, contextManager, pipeline, categorizer }
