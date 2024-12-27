export enum ContentType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Table = 'table',
}

export interface DocumentMetadata {
  title?: string
  description?: string
  tags?: string[]
  created: Date
  modified: Date
  contentType: ContentType
  category?: string
  location?: string
  customMetadata?: Record<string, any>
}

export interface SemanticChunk {
  content: string
  metadata?: Record<string, any>
}

export interface DocumentGraph {
  nodes: SemanticChunk[]
  edges: {
    source: number
    target: number
    weight: number
    type: string
  }[]
}

export interface ProcessedDocument {
  content: string
  metadata: DocumentMetadata
  chunks: SemanticChunk[]
  graph: DocumentGraph
}

export interface Condition {
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex'
  value: string
}

export interface Action {
  type: 'transform' | 'format' | 'categorize' | 'tag' | 'move'
  params: Record<string, any>
}

export interface FormatRule {
  selector: string
  style: Record<string, string>
}

export interface ModelConfig {
  name: string
  type: ContentType
  config: Record<string, any>
}

export class ModelManager {
  private models: Map<ContentType, any> = new Map()

  async getModel(contentType: ContentType): Promise<any> {
    return this.models.get(contentType)
  }

  async setModel(contentType: ContentType, model: any): Promise<void> {
    this.models.set(contentType, model)
  }
}

export class WorkflowEngine {
  protected workflows: Map<string, WorkflowDefinition> = new Map()

  async executeWorkflow(content: ProcessedContent, workflow: WorkflowDefinition): Promise<ProcessedContent> {
    // Implementation
    return content
  }

  async getWorkflowForCategory(category: string): Promise<WorkflowDefinition> {
    const workflow = this.workflows.get(category)
    if (!workflow) {
      throw new Error(`No workflow found for category: ${category}`)
    }
    return workflow
  }
}

export interface WorkflowDefinition {
  trigger: {
    contentTypes: ContentType[]
    conditions: Condition[]
  }
  actions: Action[]
  formatting?: FormatRule[]
}

export interface ProcessedContent {
  content: string
  metadata: DocumentMetadata
  relationships: DocumentGraph
  format?: FormatRule[]
}

export interface AIModelConfig {
  text: {
    local: string
    cloud?: string
  }
  vision: {
    local: string
    cloud?: string
  }
  audio: {
    local: string
    cloud?: string
  }
}

export interface ProcessingContext {
  contentType: ContentType
  workflow?: WorkflowDefinition
  modelConfig?: AIModelConfig
}
