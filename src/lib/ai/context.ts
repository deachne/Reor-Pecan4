export class ContextManager {
  private contextStack: Array<Record<string, any>>

  private maxContextSize: number

  constructor(maxContextSize: number = 10) {
    this.contextStack = []
    this.maxContextSize = maxContextSize
  }

  /**
   * Updates the current context with new information
   * @param contextData New context data to add
   */
  updateContext(contextData: Record<string, any>): void {
    if (this.contextStack.length >= this.maxContextSize) {
      this.contextStack.shift()
    }
    this.contextStack.push(contextData)
  }

  /**
   * Retrieves relevant context based on query
   * @param query Search query for context
   * @returns Relevant context data
   */
  getRelevantContext(query: string): Record<string, any> {
    return this.contextStack
      .filter((context) => this.isContextRelevant(context, query))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})
  }

  private isContextRelevant(context: Record<string, any>, query: string): boolean {
    // Simple relevance check - can be enhanced with more sophisticated matching
    const contextString = JSON.stringify(context).toLowerCase()
    const queryTerms = query.toLowerCase().split(' ')

    return queryTerms.some((term) => contextString.includes(term))
  }
}
