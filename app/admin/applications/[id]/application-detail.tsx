'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, Building, Mail, Phone, Calendar, User, FileText, 
  CheckCircle, XCircle, Clock, AlertCircle, MessageSquare, Send,
  DollarSign, Package, TrendingUp, MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/mock-data'

interface Application {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  website?: string
  taxId: string
  businessType: string
  yearsInBusiness: number
  annualRevenue: string
  expectedOrderVolume: string
  currentSuppliers: string[]
  requestedBrands: string[]
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  documents?: Array<{
    id: string
    name: string
    type: string
    url: string
    uploadedAt: string
  }>
  timeline?: Array<{
    id: string
    action: string
    actor: string
    timestamp: string
    notes?: string
  }>
}

export function ApplicationDetail({ id }: { id: string }) {
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/applications?id=${id}`)
      if (response.ok) {
        const data = await response.json()
        setApplication(data)
        setReviewNotes(data.notes || '')
      } else {
        toast.error('Failed to load application')
      }
    } catch (error) {
      console.error('Error fetching application:', error)
      toast.error('Error loading application details')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (newStatus: 'approved' | 'rejected') => {
    if (!application) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/applications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          status: newStatus,
          notes: reviewNotes,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Admin User' // Would come from auth context
        })
      })

      if (response.ok) {
        toast.success(`Application ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`)
        await fetchApplication() // Refresh data
      } else {
        toast.error('Failed to update application')
      }
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error('Error updating application status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <ApplicationDetailSkeleton />
  }

  if (!application) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Application not found</AlertDescription>
      </Alert>
    )
  }

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    under_review: { color: 'bg-blue-100 text-blue-800', icon: FileText },
    approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
  }

  const StatusIcon = statusConfig[application.status].icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{application.businessName}</h1>
          <Badge className={statusConfig[application.status].color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {application.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          Application #{application.id}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium">{application.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Business Type</p>
                  <p className="font-medium">{application.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tax ID</p>
                  <p className="font-medium">{application.taxId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Years in Business</p>
                  <p className="font-medium">{application.yearsInBusiness} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Annual Revenue</p>
                  <p className="font-medium">{application.annualRevenue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Order Volume</p>
                  <p className="font-medium">{application.expectedOrderVolume}</p>
                </div>
              </div>
              
              {application.website && (
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a href={application.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {application.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Name</p>
                    <p className="font-medium">{application.contactName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{application.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Business Address
                  </p>
                  <div className="text-sm">
                    <p>{application.businessAddress.street}</p>
                    <p>{application.businessAddress.city}, {application.businessAddress.state} {application.businessAddress.zipCode}</p>
                    <p>{application.businessAddress.country}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Shipping Address
                  </p>
                  <div className="text-sm">
                    <p>{application.shippingAddress.street}</p>
                    <p>{application.shippingAddress.city}, {application.shippingAddress.state} {application.shippingAddress.zipCode}</p>
                    <p>{application.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Suppliers</p>
                <div className="flex flex-wrap gap-2">
                  {application.currentSuppliers.map((supplier, idx) => (
                    <Badge key={idx} variant="secondary">
                      {supplier}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Requested Brands</p>
                <div className="flex flex-wrap gap-2">
                  {application.requestedBrands.map((brand, idx) => (
                    <Badge key={idx} variant="outline">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Review and process application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add internal notes about this application..."
                  rows={4}
                  disabled={application.status !== 'pending' && application.status !== 'under_review'}
                />
              </div>
              
              {(application.status === 'pending' || application.status === 'under_review') && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => updateApplicationStatus('approved')}
                    disabled={updating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updateApplicationStatus('rejected')}
                    disabled={updating}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              
              {application.status === 'approved' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Application approved on {new Date(application.reviewedAt!).toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              )}
              
              {application.status === 'rejected' && (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Application rejected on {new Date(application.reviewedAt!).toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {application.reviewedAt && (
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      application.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {application.status === 'approved' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Application {application.status === 'approved' ? 'Approved' : 'Rejected'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.reviewedAt).toLocaleString()}
                        {application.reviewedBy && ` by ${application.reviewedBy}`}
                      </p>
                      {application.notes && (
                        <p className="text-xs text-gray-600 mt-1 italic">
                          "{application.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ApplicationDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}