import { EnhancedDocumentProcessorImpl } from './enhanced-processor'
import { ModelManager } from './model-manager'
import { WorkflowEngine } from './workflow-engine'
import { ContentType, ModelConfig, WorkflowDefinition } from './types'

export class DocumentProcessingFactory {
  private static instance: DocumentProcessingFactory

  private processor: EnhancedDocumentProcessorImpl

  private modelManager: ModelManager

  private workflowEngine: WorkflowEngine

  private constructor() {
    this.modelManager = new ModelManager()
    this.workflowEngine = new WorkflowEngine()
    this.processor = new EnhancedDocumentProcessorImpl(this.modelManager, this.workflowEngine)

    // Initialize with default configurations
    this.setupDefaultConfigs()
  }

  static getInstance(): DocumentProcessingFactory {
    if (!DocumentProcessingFactory.instance) {
      DocumentProcessingFactory.instance = new DocumentProcessingFactory()
    }
    return DocumentProcessingFactory.instance
  }

  getProcessor(): EnhancedDocumentProcessorImpl {
    return this.processor
  }

  registerModelConfig(contentType: ContentType, config: ModelConfig): void {
    this.modelManager.registerModelConfig(contentType, config)
  }

  registerWorkflow(category: string, workflow: WorkflowDefinition): void {
    this.workflowEngine.registerWorkflow(category, workflow)
  }

  private setupDefaultConfigs(): void {
    // Register default model configurations
    this.registerModelConfig(ContentType.Text, {
      name: 'llama3',
      type: ContentType.Text,
      config: {
        local: true,
        modelPath: 'models/llama3',
      },
    })

    this.registerModelConfig(ContentType.Image, {
      name: 'llava',
      type: ContentType.Image,
      config: {
        local: true,
        modelPath: 'models/llava',
      },
    })

    // Register default workflows
    this.registerWorkflow('notes', {
      trigger: {
        contentTypes: [ContentType.Text],
        conditions: [],
      },
      actions: [
        {
          type: 'transform',
          params: {
            template: 'note',
          },
        },
        {
          type: 'categorize',
          params: {
            category: 'notes',
          },
        },
      ],
    })

    this.registerWorkflow('images', {
      trigger: {
        contentTypes: [ContentType.Image],
        conditions: [],
      },
      actions: [
        {
          type: 'transform',
          params: {
            template: 'image',
          },
        },
        {
          type: 'categorize',
          params: {
            category: 'images',
          },
        },
      ],
    })
  }
}
