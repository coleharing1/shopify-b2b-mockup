/**
 * @fileoverview Search indexing utilities for mock data
 * @description Provides searchable field mappings and indexing functions
 */

import { Product, Order, Company } from "./mock-data"

export interface SearchableFields {
  products: (keyof Product)[]
  orders: (keyof Order)[]
  companies: (keyof Company)[]
  resources: string[]
}

/**
 * @description Defines which fields are searchable for each data type
 */
export const searchableFields: SearchableFields = {
  products: ["name", "sku", "description", "category", "subcategory"],
  orders: ["id", "poNumber", "status"],
  companies: ["name", "accountNumber", "type", "status"],
  resources: ["title", "description", "category"]
}

/**
 * @description Highlights matching text in search results
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text
  
  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

/**
 * @description Calculates relevance score for search results
 */
export function calculateRelevance(item: any, query: string, fields: string[]): number {
  const lowerQuery = query.toLowerCase()
  let score = 0
  
  fields.forEach(field => {
    const value = item[field]
    if (!value) return
    
    const lowerValue = String(value).toLowerCase()
    
    // Exact match
    if (lowerValue === lowerQuery) {
      score += 100
    }
    // Starts with query
    else if (lowerValue.startsWith(lowerQuery)) {
      score += 50
    }
    // Contains query
    else if (lowerValue.includes(lowerQuery)) {
      score += 25
    }
    
    // Bonus for matches in important fields
    if (field === "name" || field === "title") {
      score *= 2
    } else if (field === "sku" || field === "id") {
      score *= 1.5
    }
  })
  
  return score
}

/**
 * @description Sorts search results by relevance
 */
export function sortByRelevance<T>(
  results: T[], 
  query: string, 
  fields: string[]
): T[] {
  return results.sort((a, b) => {
    const scoreA = calculateRelevance(a, query, fields)
    const scoreB = calculateRelevance(b, query, fields)
    return scoreB - scoreA
  })
}

/**
 * @description Groups search results by type
 */
export function groupResultsByType(results: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>()
  
  results.forEach(result => {
    const type = result.type
    if (!grouped.has(type)) {
      grouped.set(type, [])
    }
    grouped.get(type)?.push(result)
  })
  
  return grouped
}

/**
 * @description Filters results based on user permissions
 */
export function filterByPermissions(
  results: any[], 
  userRole: "retailer" | "sales_rep" | "admin"
): any[] {
  return results.filter(result => {
    // Retailers can't see customer data
    if (userRole === "retailer" && result.type === "customer") {
      return false
    }
    
    // Add more permission rules as needed
    
    return true
  })
}

/**
 * @description Creates search suggestions from query
 */
export function generateSuggestions(
  query: string, 
  allItems: any[], 
  field: string
): string[] {
  const lowerQuery = query.toLowerCase()
  const suggestions = new Set<string>()
  
  allItems.forEach(item => {
    const value = item[field]
    if (!value) return
    
    const lowerValue = String(value).toLowerCase()
    if (lowerValue.includes(lowerQuery) && lowerValue !== lowerQuery) {
      suggestions.add(String(value))
    }
  })
  
  return Array.from(suggestions).slice(0, 5)
}

/**
 * @description Tokenizes search query for better matching
 */
export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token.length > 1)
}

/**
 * @description Checks if item matches all search tokens
 */
export function matchesAllTokens(
  item: any, 
  tokens: string[], 
  fields: string[]
): boolean {
  return tokens.every(token => {
    return fields.some(field => {
      const value = item[field]
      if (!value) return false
      return String(value).toLowerCase().includes(token)
    })
  })
}

/**
 * @description Fuzzy string matching for typo tolerance
 */
export function fuzzyMatch(str1: string, str2: string, threshold: number = 0.8): boolean {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return true
  
  const editDistance = levenshteinDistance(longer, shorter)
  const similarity = (longer.length - editDistance) / longer.length
  
  return similarity >= threshold
}

/**
 * @description Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}