'use client'

import { useState, useEffect, useCallback } from 'react'
import { cache, debounce } from '@/lib/utils/performance'

interface UseAnalyticsOptions {
  endpoint: string
  params?: Record<string, any>
  refreshInterval?: number
  cacheKey?: string
  cacheTTL?: number
}

export function useAnalytics<T>({
  endpoint,
  params = {},
  refreshInterval,
  cacheKey,
  cacheTTL = 300000 // 5 minutes
}: UseAnalyticsOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      // Check cache first
      if (cacheKey) {
        const cachedData = cache.get<T>(cacheKey)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return
        }
      }

      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams(params).toString()
      const url = queryParams ? `${endpoint}?${queryParams}` : endpoint
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Cache the result
      if (cacheKey) {
        cache.set(cacheKey, result, cacheTTL)
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [endpoint, params, cacheKey, cacheTTL])

  const refresh = useCallback(() => {
    if (cacheKey) {
      cache.invalidate(cacheKey)
    }
    fetchData()
  }, [cacheKey, fetchData])

  useEffect(() => {
    fetchData()

    if (refreshInterval) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refresh
  }
}

// Hook for paginated data
export function usePaginatedAnalytics<T>({
  endpoint,
  pageSize = 10,
  params = {}
}: {
  endpoint: string
  pageSize?: number
  params?: Record<string, any>
}) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPage = useCallback(async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        ...params,
        page: pageNum.toString(),
        pageSize: pageSize.toString()
      }).toString()
      
      const response = await fetch(`${endpoint}?${queryParams}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (pageNum === 1) {
        setData(result.data || [])
      } else {
        setData(prev => [...prev, ...(result.data || [])])
      }

      setHasMore(result.hasMore || false)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [endpoint, pageSize, params])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPage(page + 1)
    }
  }, [loading, hasMore, page, fetchPage])

  const reset = useCallback(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    fetchPage(1)
  }, [fetchPage])

  useEffect(() => {
    fetchPage(1)
  }, []) // Only fetch on mount

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  }
}

// Hook for real-time metrics
export function useRealtimeMetrics({
  endpoint,
  interval = 5000
}: {
  endpoint: string
  interval?: number
}) {
  const [metrics, setMetrics] = useState<Record<string, any>>({})
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const connect = () => {
      eventSource = new EventSource(endpoint)

      eventSource.onopen = () => {
        setConnected(true)
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setMetrics(data)
        } catch (err) {
          console.error('Failed to parse metrics:', err)
        }
      }

      eventSource.onerror = () => {
        setConnected(false)
        eventSource?.close()
        
        // Reconnect after a delay
        setTimeout(connect, interval)
      }
    }

    connect()

    return () => {
      eventSource?.close()
    }
  }, [endpoint, interval])

  return {
    metrics,
    connected
  }
}

// Hook for search with debouncing
export function useAnalyticsSearch<T>({
  endpoint,
  delay = 300
}: {
  endpoint: string
  delay?: number
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [searching, setSearching] = useState(false)

  const search = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setSearching(false)
        return
      }

      try {
        setSearching(true)
        
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(searchQuery)}`)
        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setResults(data.results || [])
      } catch (err) {
        console.error('Search error:', err)
        setResults([])
      } finally {
        setSearching(false)
      }
    }, delay),
    [endpoint, delay]
  )

  useEffect(() => {
    search(query)
  }, [query, search])

  return {
    query,
    setQuery,
    results,
    searching
  }
}