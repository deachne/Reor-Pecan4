interface EnhancedSearch {
  // Semantic search with context
  semanticSearch(query: string, context: SearchContext): Promise<SearchResult[]>

  // Hybrid search combining different approaches
  hybridSearch(params: HybridSearchParams): Promise<SearchResult[]>

  // Relationship-aware search
  graphSearch(query: string, depth: number): Promise<GraphSearchResult[]>
}
