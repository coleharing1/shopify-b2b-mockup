'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Send,
  Eye,
  ArrowRight
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface QuoteNotification {
  id: string
  type: 'expiring' | 'viewed' | 'accepted' | 'rejected' | 'new' | 'revised'
  quoteId: string
  quoteNumber: string
  companyName: string
  timestamp: Date
  message: string
  read: boolean
  urgent: boolean
}

export function QuoteNotifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<QuoteNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      // Fetch quotes and generate notifications
      const [quotesResponse, expiringResponse] = await Promise.all([
        fetch('/api/quotes?status=sent,viewed'),
        fetch('/api/quotes/expiring')
      ])

      if (quotesResponse.ok && expiringResponse.ok) {
        const { quotes } = await quotesResponse.json()
        const { quotes: expiringQuotes } = await expiringResponse.json()

        const notifs: QuoteNotification[] = []

        // Add expiring quote notifications
        expiringQuotes.forEach((quote: any) => {
          const daysUntilExpiry = Math.ceil(
            (new Date(quote.terms.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
          notifs.push({
            id: `expiring-${quote.id}`,
            type: 'expiring',
            quoteId: quote.id,
            quoteNumber: quote.number,
            companyName: quote.companyName,
            timestamp: new Date(),
            message: `Quote expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
            read: false,
            urgent: daysUntilExpiry <= 1
          })
        })

        // Add recently viewed notifications
        quotes
          .filter((q: any) => q.status === 'viewed')
          .slice(0, 3)
          .forEach((quote: any) => {
            const viewedEvent = quote.timeline.find((e: any) => e.type === 'viewed')
            if (viewedEvent) {
              notifs.push({
                id: `viewed-${quote.id}`,
                type: 'viewed',
                quoteId: quote.id,
                quoteNumber: quote.number,
                companyName: quote.companyName,
                timestamp: new Date(viewedEvent.timestamp),
                message: 'Customer viewed the quote',
                read: false,
                urgent: false
              })
            }
          })

        setNotifications(notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const sendReminder = async (quoteId: string) => {
    try {
      // In a real app, this would send an email
      toast.success('Reminder sent to customer')
      markAsRead(`expiring-${quoteId}`)
    } catch (error) {
      toast.error('Failed to send reminder')
    }
  }

  const getIcon = (type: QuoteNotification['type']) => {
    switch (type) {
      case 'expiring':
        return <AlertTriangle className="h-4 w-4" />
      case 'viewed':
        return <Eye className="h-4 w-4" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'new':
      case 'revised':
        return <Bell className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getIconColor = (type: QuoteNotification['type'], urgent: boolean) => {
    if (urgent) return 'text-red-600'
    switch (type) {
      case 'expiring':
        return 'text-yellow-600'
      case 'viewed':
        return 'text-blue-600'
      case 'accepted':
        return 'text-green-600'
      case 'rejected':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5)

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading notifications...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Quote Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/rep/quotes')}
          >
            View All Quotes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Stay updated on your quotes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No new notifications</p>
            <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedNotifications.map((notification) => (
              <Alert
                key={notification.id}
                className={`cursor-pointer transition-all ${
                  notification.read ? 'opacity-60' : ''
                } ${
                  notification.urgent ? 'border-red-200 bg-red-50' : ''
                }`}
                onClick={() => {
                  markAsRead(notification.id)
                  router.push(`/rep/quotes/${notification.quoteId}`)
                }}
              >
                <div className={getIconColor(notification.type, notification.urgent)}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <AlertTitle className="text-sm font-medium">
                    {notification.quoteNumber} - {notification.companyName}
                  </AlertTitle>
                  <AlertDescription className="text-sm mt-1">
                    <p>{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </AlertDescription>
                </div>
                {notification.type === 'expiring' && !notification.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      sendReminder(notification.quoteId)
                    }}
                  >
                    <Send className="h-3 w-3" />
                    Remind
                  </Button>
                )}
              </Alert>
            ))}

            {notifications.length > 5 && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `Show ${notifications.length - 5} More`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}