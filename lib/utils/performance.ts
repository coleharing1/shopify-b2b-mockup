// Performance optimization utilities

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize = 100
  private cleanupInterval = 60000 // 1 minute
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor() {
    this.startCleanup()
  }

  private startCleanup() {
    if (this.cleanupTimer) return
    
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.cleanupInterval)
  }

  private cleanup() {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))

    // If cache is too large, remove oldest entries
    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, this.cache.size - this.maxSize)
      toRemove.forEach(([key]) => this.cache.delete(key))
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  set<T>(key: string, data: T, ttl = 300000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    const regex = new RegExp(pattern)
    const keysToDelete: string[] = []
    
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    this.cache.clear()
  }
}

export const cache = new MemoryCache()

// Debounce function for search and filter operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Memoization for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func(...args)
    cache.set(key, result)
    
    // Limit cache size
    if (cache.size > 100) {
      const iter = cache.keys().next()
      if (!iter.done) {
        cache.delete(iter.value as string)
      }
    }

    return result
  }) as T
}

// Batch API requests
export class RequestBatcher<T, R> {
  private batch: T[] = []
  private timeout: NodeJS.Timeout | null = null
  private readonly maxBatchSize: number
  private readonly batchDelay: number
  private readonly processor: (items: T[]) => Promise<R[]>
  private readonly resolvers: Array<{
    resolve: (value: R) => void
    reject: (error: any) => void
  }> = []

  constructor(
    processor: (items: T[]) => Promise<R[]>,
    maxBatchSize = 10,
    batchDelay = 50
  ) {
    this.processor = processor
    this.maxBatchSize = maxBatchSize
    this.batchDelay = batchDelay
  }

  async add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.batch.push(item)
      this.resolvers.push({ resolve, reject })

      if (this.batch.length >= this.maxBatchSize) {
        this.flush()
      } else {
        this.scheduleFlush()
      }
    })
  }

  private scheduleFlush() {
    if (this.timeout) return

    this.timeout = setTimeout(() => {
      this.flush()
    }, this.batchDelay)
  }

  private async flush() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    if (this.batch.length === 0) return

    const currentBatch = [...this.batch]
    const currentResolvers = [...this.resolvers]
    
    this.batch = []
    this.resolvers.length = 0

    try {
      const results = await this.processor(currentBatch)
      
      results.forEach((result, index) => {
        currentResolvers[index]?.resolve(result)
      })
    } catch (error) {
      currentResolvers.forEach(resolver => {
        resolver.reject(error)
      })
    }
  }
}

// Lazy loading for images and components
export function lazyLoad<T>(
  importFunc: () => Promise<T>,
  preload = false
): () => Promise<T> {
  let module: T | null = null
  let promise: Promise<T> | null = null

  const load = () => {
    if (module) return Promise.resolve(module)
    if (promise) return promise

    promise = importFunc().then(m => {
      module = m
      return m
    })

    return promise
  }

  if (preload) {
    load()
  }

  return load
}

// Virtual scrolling helper
export class VirtualScroller<T> {
  private items: T[] = []
  private itemHeight: number
  private containerHeight: number
  private scrollTop = 0
  private overscan = 3

  constructor(items: T[], itemHeight: number, containerHeight: number) {
    this.items = items
    this.itemHeight = itemHeight
    this.containerHeight = containerHeight
  }

  updateScroll(scrollTop: number) {
    this.scrollTop = scrollTop
  }

  updateContainerHeight(height: number) {
    this.containerHeight = height
  }

  updateItems(items: T[]) {
    this.items = items
  }

  getVisibleItems(): {
    items: T[]
    startIndex: number
    endIndex: number
    offsetY: number
  } {
    const startIndex = Math.max(
      0,
      Math.floor(this.scrollTop / this.itemHeight) - this.overscan
    )
    
    const endIndex = Math.min(
      this.items.length - 1,
      Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + this.overscan
    )

    return {
      items: this.items.slice(startIndex, endIndex + 1),
      startIndex,
      endIndex,
      offsetY: startIndex * this.itemHeight
    }
  }

  getTotalHeight(): number {
    return this.items.length * this.itemHeight
  }
}