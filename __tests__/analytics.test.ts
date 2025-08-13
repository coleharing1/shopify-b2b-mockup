// Jest is configured globally, no need to import describe, it, expect, beforeEach
import { AnalyticsService } from '@/lib/services/analytics-service'
import { ReportingService } from '@/lib/services/reporting-service'
import { cache, debounce, throttle, memoize } from '@/lib/utils/performance'

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSalesMetrics', () => {
    it('should calculate sales metrics correctly', async () => {
      const dateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      }

      const metrics = await AnalyticsService.getSalesMetrics(dateRange)

      expect(metrics).toHaveProperty('totalRevenue')
      expect(metrics).toHaveProperty('orderCount')
      expect(metrics).toHaveProperty('averageOrderValue')
      expect(metrics).toHaveProperty('conversionRate')
      expect(metrics.totalRevenue).toBeGreaterThanOrEqual(0)
      expect(metrics.orderCount).toBeGreaterThanOrEqual(0)
    })

    it('should apply filters correctly', async () => {
      const dateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      }

      const filters = {
        companyId: 'test-company',
        orderType: 'at-once' as const,
        region: 'west'
      }

      const metrics = await AnalyticsService.getSalesMetrics(dateRange, filters)

      expect(metrics).toBeDefined()
      // Filtered results should be less than or equal to unfiltered
      const unfilteredMetrics = await AnalyticsService.getSalesMetrics(dateRange)
      expect(metrics.orderCount).toBeLessThanOrEqual(unfilteredMetrics.orderCount)
    })
  })

  describe('getInventoryMetrics', () => {
    it('should return inventory metrics', async () => {
      const metrics = await AnalyticsService.getInventoryMetrics()

      expect(metrics).toHaveProperty('totalProducts')
      expect(metrics).toHaveProperty('lowStockItems')
      expect(metrics).toHaveProperty('outOfStockItems')
      expect(metrics).toHaveProperty('turnoverRate')
      expect(metrics).toHaveProperty('averageStockLevel')
    })

    it('should identify low stock items', async () => {
      const metrics = await AnalyticsService.getInventoryMetrics()

      expect(Array.isArray(metrics.alerts)).toBe(true)
      metrics.alerts.forEach(alert => {
        expect(alert).toHaveProperty('productId')
        expect(alert).toHaveProperty('currentStock')
        expect(alert).toHaveProperty('reorderPoint')
        expect(alert).toHaveProperty('severity')
      })
    })
  })

  describe('getCustomerMetrics', () => {
    it('should calculate customer metrics', async () => {
      const metrics = await AnalyticsService.getCustomerMetrics()

      expect(metrics).toHaveProperty('totalCustomers')
      expect(metrics).toHaveProperty('activeCustomers')
      expect(metrics).toHaveProperty('newCustomers')
      expect(metrics).toHaveProperty('averageOrderFrequency')
      expect(metrics).toHaveProperty('customerLifetimeValue')
      expect(metrics).toHaveProperty('retentionRate')
    })

    it('should calculate metrics for specific company', async () => {
      const companyMetrics = await AnalyticsService.getCustomerMetrics('test-company')

      expect(companyMetrics).toHaveProperty('healthScore')
      expect(companyMetrics.healthScore).toBeGreaterThanOrEqual(0)
      expect(companyMetrics.healthScore).toBeLessThanOrEqual(100)
    })
  })

  describe('getKPISnapshot', () => {
    it('should return current KPIs', async () => {
      const kpis = await AnalyticsService.getKPISnapshot()

      expect(kpis).toHaveProperty('revenue')
      expect(kpis).toHaveProperty('orders')
      expect(kpis).toHaveProperty('customers')
      expect(kpis).toHaveProperty('inventory')

      // Each KPI should have current and previous values
      Object.values(kpis).forEach(kpi => {
        expect(kpi).toHaveProperty('current')
        expect(kpi).toHaveProperty('previous')
        expect(kpi).toHaveProperty('change')
        expect(kpi).toHaveProperty('trend')
      })
    })
  })
})

describe('Reporting Service', () => {
  describe('generateReport', () => {
    it('should generate sales report', async () => {
      const report = await ReportingService.generateReport(
        'sales',
        { dateRange: { start: '2024-01-01', end: '2024-01-31' } },
        'json'
      )

      expect(report).toHaveProperty('data')
      expect(report).toHaveProperty('metadata')
      expect(report.metadata).toHaveProperty('generatedAt')
      expect(report.metadata).toHaveProperty('reportType')
    })

    it('should export to different formats', async () => {
      const data = { test: 'data' }

      const csvBlob = await ReportingService.exportData(data, 'csv')
      expect(csvBlob).toBeInstanceOf(Blob)
      expect(csvBlob.type).toBe('text/csv')

      const jsonBlob = await ReportingService.exportData(data, 'json')
      expect(jsonBlob).toBeInstanceOf(Blob)
      expect(jsonBlob.type).toBe('application/json')
    })
  })

  describe('scheduleReport', () => {
    it('should schedule recurring reports', async () => {
      const config = {
        name: 'Monthly Sales Report',
        type: 'sales' as const,
        schedule: 'monthly' as const,
        format: 'pdf' as const,
        recipients: ['test@example.com'],
        filters: {}
      }

      const scheduled = await ReportingService.scheduleReport(config)

      expect(scheduled).toHaveProperty('id')
      expect(scheduled).toHaveProperty('nextRun')
      expect(scheduled.name).toBe(config.name)
    })
  })
})

describe('Performance Utilities', () => {
  describe('cache', () => {
    it('should cache and retrieve data', () => {
      const testData = { value: 42 }
      cache.set('test-key', testData)

      const retrieved = cache.get('test-key')
      expect(retrieved).toEqual(testData)
    })

    it('should respect TTL', async () => {
      cache.set('ttl-test', 'data', 100) // 100ms TTL

      expect(cache.get('ttl-test')).toBe('data')

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(cache.get('ttl-test')).toBeNull()
    })

    it('should invalidate by pattern', () => {
      cache.set('user-1', 'data1')
      cache.set('user-2', 'data2')
      cache.set('product-1', 'data3')

      cache.invalidate('user-*')

      expect(cache.get('user-1')).toBeNull()
      expect(cache.get('user-2')).toBeNull()
      expect(cache.get('product-1')).toBe('data3')
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = jest.fn()
      const debounced = debounce(fn, 100)

      debounced('a')
      debounced('b')
      debounced('c')

      expect(fn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('c')
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = jest.fn()
      const throttled = throttle(fn, 100)

      throttled('a')
      throttled('b')
      throttled('c')

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('a')

      await new Promise(resolve => setTimeout(resolve, 150))

      throttled('d')
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith('d')
    })
  })

  describe('memoize', () => {
    it('should memoize function results', () => {
      const expensiveFn = jest.fn((x: number) => x * 2)
      const memoized = memoize(expensiveFn)

      expect(memoized(5)).toBe(10)
      expect(memoized(5)).toBe(10)
      expect(memoized(5)).toBe(10)

      expect(expensiveFn).toHaveBeenCalledTimes(1)

      expect(memoized(10)).toBe(20)
      expect(expensiveFn).toHaveBeenCalledTimes(2)
    })

    it('should use custom resolver', () => {
      const fn = jest.fn((a: number, b: number) => a + b)
      const memoized = memoize(fn, (a, b) => `${a}-${b}`)

      memoized(1, 2)
      memoized(1, 2)
      memoized(2, 1)

      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})

describe('Chart Data Calculations', () => {
  it('should calculate trend percentages correctly', () => {
    const data = [
      { label: 'Jan', value: 100 },
      { label: 'Feb', value: 120 },
      { label: 'Mar', value: 110 }
    ]

    const firstValue = data[0].value
    const lastValue = data[data.length - 1].value
    const trend = ((lastValue - firstValue) / firstValue) * 100

    expect(trend).toBe(10) // 10% increase
  })

  it('should handle pie chart percentages', () => {
    const data = [
      { label: 'A', value: 25 },
      { label: 'B', value: 35 },
      { label: 'C', value: 40 }
    ]

    const total = data.reduce((sum, item) => sum + item.value, 0)
    const percentages = data.map(item => (item.value / total) * 100)

    expect(total).toBe(100)
    expect(percentages[0]).toBe(25)
    expect(percentages[1]).toBe(35)
    expect(percentages[2]).toBe(40)
  })

  it('should generate heat map data correctly', () => {
    const data = [
      { x: 'Mon', y: '9am', value: 10 },
      { x: 'Mon', y: '10am', value: 20 },
      { x: 'Tue', y: '9am', value: 15 }
    ]

    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))

    expect(maxValue).toBe(20)
    expect(minValue).toBe(10)

    // Color intensity calculation
    data.forEach(item => {
      const intensity = ((item.value - minValue) / (maxValue - minValue)) * 100
      expect(intensity).toBeGreaterThanOrEqual(0)
      expect(intensity).toBeLessThanOrEqual(100)
    })
  })
})