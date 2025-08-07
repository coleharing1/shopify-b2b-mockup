"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ActivityItem {
  id: string
  type: 'order' | 'quote' | 'application' | 'message'
  description: string
  timestamp: Date
  userId?: string
  companyId?: string
  metadata?: any
}

interface AppMetrics {
  totalOrders: number
  totalQuotes: number
  totalApplications: number
  recentActivity: ActivityItem[]
}

interface AppStateContextType {
  metrics: AppMetrics
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void
  incrementOrders: () => void
  incrementQuotes: () => void
  incrementApplications: () => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

/**
 * @description Global app state provider for tracking cross-component actions
 * @fileoverview Manages application-wide state like recent activity and metrics
 */
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<AppMetrics>({
    totalOrders: 0,
    totalQuotes: 0,
    totalApplications: 0,
    recentActivity: []
  })

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    setMetrics(prev => ({
      ...prev,
      recentActivity: [newActivity, ...prev.recentActivity].slice(0, 50) // Keep last 50 activities
    }))
  }

  const incrementOrders = () => {
    setMetrics(prev => ({
      ...prev,
      totalOrders: prev.totalOrders + 1
    }))
  }

  const incrementQuotes = () => {
    setMetrics(prev => ({
      ...prev,
      totalQuotes: prev.totalQuotes + 1
    }))
  }

  const incrementApplications = () => {
    setMetrics(prev => ({
      ...prev,
      totalApplications: prev.totalApplications + 1
    }))
  }

  return (
    <AppStateContext.Provider value={{
      metrics,
      addActivity,
      incrementOrders,
      incrementQuotes,
      incrementApplications
    }}>
      {children}
    </AppStateContext.Provider>
  )
}

/**
 * @description Hook to access app state context
 * @returns {AppStateContextType} App state context with metrics and actions
 * @throws {Error} If used outside of AppStateProvider
 */
export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}