export interface EnhancedDBEntry extends DBEntry {
  // Add semantic metadata
  semanticType: string
  relationships: Relationship[]

  // Multiple vector representations
  primaryVector: number[]
  contextVector: number[]

  // Enhanced metadata
  metadata: DocumentMetadata
  hierarchyLevel: number
}
