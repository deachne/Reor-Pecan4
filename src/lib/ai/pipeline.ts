import { Context } from './types'

export class AIPipeline {
  private processors: Array<(input: any) => Promise<any>>

  private context: Context

  constructor(context: Context) {
    this.processors = []
    this.context = context
  }

  /**
   * Adds a processing step to the pipeline
   * @param processor Function that processes the input
   */
  addProcessor(processor: (input: any) => Promise<any>): void {
    this.processors.push(processor)
  }

  /**
   * Executes the processing pipeline with context awareness
   * @param input Initial input data
   * @returns Processed result
   */
  async execute(input: any): Promise<any> {
    let result = input

    for (const processor of this.processors) {
      try {
        result = await processor(result)
        this.context.updateState(result)
      } catch (error) {
        this.handleProcessingError(error)
      }
    }

    return result
  }

  private handleProcessingError(error: unknown): void {
    if (error instanceof Error) {
      console.error('Pipeline processing error:', error)
      throw error
    }
    // Handle non-Error types
    console.error('Unknown pipeline error:', String(error))
    throw new Error('Unknown pipeline error occurred')
  }
}
