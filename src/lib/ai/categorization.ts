import { Category, CategoryRule } from './types'

export class SmartCategorizer {
  private rules: CategoryRule[]

  private categories: Category[]

  constructor() {
    this.rules = []
    this.categories = []
  }

  /**
   * Categorizes input data using AI-powered rules
   * @param input Data to categorize
   * @returns Categorized data with confidence scores
   */
  async categorize(input: any): Promise<Array<{ category: Category; confidence: number }>> {
    const results = await Promise.all(
      this.rules.map(async (rule) => {
        const confidence = await rule.evaluate(input)
        return {
          category: rule.category,
          confidence,
        }
      }),
    )

    return results.filter((result) => result.confidence > 0.5).sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Adds a new categorization rule
   * @param rule Categorization rule to add
   */
  addRule(rule: CategoryRule): void {
    this.rules.push(rule)
  }
}
