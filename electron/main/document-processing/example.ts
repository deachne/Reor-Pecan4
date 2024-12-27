import { DocumentProcessingFactory } from './factory'
import { ContentType, ProcessingContext } from './types'

async function processTextExample(): Promise<void> {
  const factory = DocumentProcessingFactory.getInstance()
  const processor = factory.getProcessor()

  // Process a text document
  const textContent = '# Meeting Notes\n\nDiscussed project timeline and milestones...'
  const context: ProcessingContext = {
    contentType: ContentType.Text,
    workflow: {
      trigger: {
        contentTypes: [ContentType.Text],
        conditions: [],
      },
      actions: [
        {
          type: 'transform',
          params: {
            template: 'meeting-notes',
          },
        },
        {
          type: 'categorize',
          params: {
            category: 'meetings',
          },
        },
        {
          type: 'tag',
          params: {
            tags: ['meeting', 'project'],
          },
        },
      ],
    },
  }

  const result = await processor.processContent(textContent, context)
  console.log('Processed Text Result:', result)
}

async function processImageExample(): Promise<void> {
  const factory = DocumentProcessingFactory.getInstance()
  const processor = factory.getProcessor()

  // Process an image
  const imageBuffer = Buffer.from('') // Replace with actual image data
  const context: ProcessingContext = {
    contentType: ContentType.Image,
    workflow: {
      trigger: {
        contentTypes: [ContentType.Image],
        conditions: [],
      },
      actions: [
        {
          type: 'transform',
          params: {
            template: 'image-note',
          },
        },
        {
          type: 'categorize',
          params: {
            category: 'screenshots',
          },
        },
        {
          type: 'tag',
          params: {
            tags: ['image', 'screenshot'],
          },
        },
      ],
    },
  }

  const result = await processor.processContent(imageBuffer, context)
  console.log('Processed Image Result:', result)
}

async function processVideoExample(): Promise<void> {
  const factory = DocumentProcessingFactory.getInstance()
  const processor = factory.getProcessor()

  // Process a video
  const videoBuffer = Buffer.from('') // Replace with actual video data
  const context: ProcessingContext = {
    contentType: ContentType.Video,
    workflow: {
      trigger: {
        contentTypes: [ContentType.Video],
        conditions: [],
      },
      actions: [
        {
          type: 'transform',
          params: {
            template: 'video-note',
          },
        },
        {
          type: 'categorize',
          params: {
            category: 'recordings',
          },
        },
        {
          type: 'tag',
          params: {
            tags: ['video', 'recording'],
          },
        },
      ],
    },
  }

  const result = await processor.processContent(videoBuffer, context)
  console.log('Processed Video Result:', result)
}

// Example usage
async function main() {
  try {
    await processTextExample()
    await processImageExample()
    await processVideoExample()
  } catch (error) {
    console.error('Processing error:', error)
  }
}

main()
