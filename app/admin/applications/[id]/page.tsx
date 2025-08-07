"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertWithIcon } from "@/components/ui/alert"
import { 
  ArrowLeft,
  Building,
  User,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Send,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Shield
} from "lucide-react"

// Mock application data - in production this would come from an API
const mockApplication = {
  id: "APP-2025-047",
  status: "pending",
  submittedAt: "2025-08-07T10:00:00Z",
  companyInfo: {
    businessName: "Outdoor Adventures LLC",
    dba: "Adventure Gear Store",
    ein: "12-3456789",
    businessType: "LLC",
    yearEstablished: "2015",
    website: "www.adventuregear.com",
    physicalAddress: {
      street: "123 Mountain View Dr",
      city: "Boulder",
      state: "CO",
      zip: "80301"
    },
    billingAddress: {
      sameAsPhysical: true
    },
    primaryContact: {
      firstName: "John",
      lastName: "Smith",
      title: "Owner",
      email: "john@adventuregear.com",
      phone: "303-555-0123"
    },
    accountsPayableContact: {
      sameAsPrimary: true
    }
  },
  documents: {
    'resale-certificate': {
      filename: "resale-cert-co.pdf",
      uploadedAt: "2025-08-07T09:55:00Z",
      size: "245 KB"
    },
    'business-license': {
      filename: "business-license.pdf",
      uploadedAt: "2025-08-07T09:56:00Z",
      size: "180 KB"
    },
    'w9': {
      filename: "w9-form.pdf",
      uploadedAt: "2025-08-07T09:57:00Z",
      size: "95 KB"
    }
  },
  creditApplication: {
    requestCredit: true,
    creditAmount: "25000",
    bankingInfo: {
      bankName: "First National Bank",
      accountName: "Outdoor Adventures LLC",
      accountNumber: "****5678",
      routingNumber: "****4321"
    },
    tradeReferences: [
      {
        companyName: "Wholesale Sports Supply",
        contactName: "Mary Johnson",
        phone: "800-555-0100",
        email: "mary@wholesalesports.com"
      },
      {
        companyName: "Mountain Equipment Co",
        contactName: "Bob Wilson",
        phone: "888-555-0200",
        email: "bob@mountainequip.com"
      },
      {
        companyName: "Outdoor Distributors Inc",
        contactName: "Sarah Davis",
        phone: "877-555-0300",
        email: "sarah@outdoordist.com"
      }
    ],
    authorizedSignature: {
      name: "John Smith",
      title: "Owner",
      date: "2025-08-07",
      agreed: true
    }
  },
  creditCheck: {
    score: 720,
    risk: "Low",
    checkedAt: "2025-08-07T10:30:00Z",
    reportUrl: "#"
  },
  notes: [
    {
      id: 1,
      author: "System",
      timestamp: "2025-08-07T10:30:00Z",
      content: "Automatic credit check completed. Score: 720 (Low risk)"
    },
    {
      id: 2,
      author: "System",
      timestamp: "2025-08-07T10:00:00Z",
      content: "Application submitted via online portal"
    }
  ]
}

/**
 * @description Admin application detail and review page
 * @fileoverview Comprehensive view of dealer application with approval actions
 */
export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [internalNotes, setInternalNotes] = useState("")
  const [creditLimit, setCreditLimit] = useState(mockApplication.creditApplication.creditAmount)
  const [isProcessing, setIsProcessing] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'reviewing':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push('/admin/applications?approved=true')
  }

  const handleReject = async () => {
    if (!internalNotes) {
      alert("Please provide a reason for rejection")
      return
    }
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push('/admin/applications?rejected=true')
  }

  const handleRequestInfo = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/applications"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Applications
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(mockApplication.status)}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockApplication.id}</h1>
              <p className="text-sm text-gray-600">
                Submitted {new Date(mockApplication.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Applicant
            </Button>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {mockApplication.status === 'pending' && (
        <AlertWithIcon
          variant="warning"
          title="Pending Review"
          description="This application is awaiting review. Credit check has been completed automatically."
          className="mb-6"
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="company">
            <TabsList>
              <TabsTrigger value="company">Company Info</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="credit">Credit Application</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6 mt-6">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <CardTitle>Business Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Legal Business Name</dt>
                      <dd className="mt-1 text-sm">{mockApplication.companyInfo.businessName}</dd>
                    </div>
                    {mockApplication.companyInfo.dba && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">DBA</dt>
                        <dd className="mt-1 text-sm">{mockApplication.companyInfo.dba}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-600">EIN</dt>
                      <dd className="mt-1 text-sm font-mono">{mockApplication.companyInfo.ein}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Business Type</dt>
                      <dd className="mt-1 text-sm">{mockApplication.companyInfo.businessType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Year Established</dt>
                      <dd className="mt-1 text-sm">{mockApplication.companyInfo.yearEstablished}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Website</dt>
                      <dd className="mt-1 text-sm">
                        <a href={`https://${mockApplication.companyInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {mockApplication.companyInfo.website}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Addresses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <CardTitle>Addresses</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Physical Address</h4>
                      <address className="text-sm text-gray-600 not-italic">
                        {mockApplication.companyInfo.physicalAddress.street}<br />
                        {mockApplication.companyInfo.physicalAddress.city}, {mockApplication.companyInfo.physicalAddress.state} {mockApplication.companyInfo.physicalAddress.zip}
                      </address>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Billing Address</h4>
                      <p className="text-sm text-gray-600">
                        {mockApplication.companyInfo.billingAddress.sameAsPhysical 
                          ? "Same as physical address" 
                          : "Different billing address"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contacts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <CardTitle>Contacts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Primary Contact</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">
                            {mockApplication.companyInfo.primaryContact.firstName} {mockApplication.companyInfo.primaryContact.lastName}
                          </span>
                          <br />
                          <span className="text-gray-600">{mockApplication.companyInfo.primaryContact.title}</span>
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${mockApplication.companyInfo.primaryContact.email}`} className="hover:text-primary">
                            {mockApplication.companyInfo.primaryContact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${mockApplication.companyInfo.primaryContact.phone}`} className="hover:text-primary">
                            {mockApplication.companyInfo.primaryContact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Accounts Payable Contact</h4>
                      <p className="text-sm text-gray-600">
                        {mockApplication.companyInfo.accountsPayableContact.sameAsPrimary 
                          ? "Same as primary contact" 
                          : "Different AP contact"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                  <CardDescription>
                    All documents have been verified and are valid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(mockApplication.documents).map(([type, doc]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">
                              {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </p>
                            <p className="text-xs text-gray-600">
                              {doc.filename} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credit" className="space-y-6 mt-6">
              {/* Credit Request */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <CardTitle>Credit Application</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Requested Credit Limit</Label>
                      <p className="text-2xl font-bold">${parseInt(mockApplication.creditApplication.creditAmount).toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <Label>Banking Information</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">{mockApplication.creditApplication.bankingInfo.bankName}</span><br />
                          Account: {mockApplication.creditApplication.bankingInfo.accountNumber}<br />
                          Routing: {mockApplication.creditApplication.bankingInfo.routingNumber}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>Trade References</Label>
                      <div className="mt-2 space-y-2">
                        {mockApplication.creditApplication.tradeReferences.map((ref, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium">{ref.companyName}</p>
                            <p className="text-xs text-gray-600">
                              {ref.contactName} • {ref.phone} • {ref.email}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Authorization</Label>
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm">
                          <CheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
                          Authorized by <strong>{mockApplication.creditApplication.authorizedSignature.name}</strong> ({mockApplication.creditApplication.authorizedSignature.title})
                          <br />
                          <span className="text-xs text-gray-600">
                            Signed on {mockApplication.creditApplication.authorizedSignature.date}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockApplication.notes.map((note) => (
                      <div key={note.id} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">{note.author}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(note.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Actions & Summary */}
        <div className="space-y-6">
          {/* Credit Check Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>Credit Check Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {mockApplication.creditCheck.score}
                </div>
                <Badge variant="success" className="mb-4">
                  <Shield className="h-3 w-3 mr-1" />
                  {mockApplication.creditCheck.risk} Risk
                </Badge>
                <p className="text-xs text-gray-500">
                  Checked {new Date(mockApplication.creditCheck.checkedAt).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Report
              </Button>
            </CardContent>
          </Card>

          {/* Approval Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="creditLimit">Approved Credit Limit</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="creditLimit"
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Requested: ${parseInt(mockApplication.creditApplication.creditAmount).toLocaleString()}
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this application..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="space-y-2 pt-4">
                <Button 
                  className="w-full" 
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Approve Application"}
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  Reject Application
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleRequestInfo}
                  disabled={isProcessing}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Request More Information
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Primary Contact
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}