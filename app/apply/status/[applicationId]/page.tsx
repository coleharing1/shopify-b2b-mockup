"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertWithIcon } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Home,
  ArrowRight,
  Download,
  Calendar,
  Shield,
  User,
  Building
} from "lucide-react"

// Mock application status data
const getApplicationStatus = (id: string) => {
  // Different statuses for demo purposes
  if (id.includes("001")) {
    return {
      id: "APP-2025-001",
      status: "pending",
      submittedAt: "2025-08-07T10:00:00Z",
      lastUpdated: "2025-08-07T10:00:00Z",
      companyName: "Outdoor Adventures LLC",
      contactEmail: "john@adventuregear.com",
      estimatedReviewTime: "1-2 business days",
      progress: 25,
      timeline: [
        {
          step: "Application Submitted",
          status: "completed",
          timestamp: "2025-08-07T10:00:00Z",
          description: "Your application has been received"
        },
        {
          step: "Document Verification",
          status: "in-progress",
          timestamp: null,
          description: "Verifying your business documents"
        },
        {
          step: "Credit Review",
          status: "pending",
          timestamp: null,
          description: "Reviewing credit application"
        },
        {
          step: "Final Decision",
          status: "pending",
          timestamp: null,
          description: "Application decision"
        }
      ]
    }
  } else if (id.includes("002")) {
    return {
      id: "APP-2025-002",
      status: "approved",
      submittedAt: "2025-08-05T14:00:00Z",
      lastUpdated: "2025-08-06T16:30:00Z",
      approvedAt: "2025-08-06T16:30:00Z",
      companyName: "Mountain Gear Supply",
      contactEmail: "contact@mountaingear.com",
      approvedCreditLimit: 35000,
      accountNumber: "ACC-2025-1234",
      progress: 100,
      timeline: [
        {
          step: "Application Submitted",
          status: "completed",
          timestamp: "2025-08-05T14:00:00Z",
          description: "Your application has been received"
        },
        {
          step: "Document Verification",
          status: "completed",
          timestamp: "2025-08-05T16:00:00Z",
          description: "All documents verified successfully"
        },
        {
          step: "Credit Review",
          status: "completed",
          timestamp: "2025-08-06T10:00:00Z",
          description: "Credit application approved"
        },
        {
          step: "Final Decision",
          status: "completed",
          timestamp: "2025-08-06T16:30:00Z",
          description: "Application approved! Welcome aboard!"
        }
      ]
    }
  } else {
    return {
      id: "APP-2025-003",
      status: "rejected",
      submittedAt: "2025-08-04T09:00:00Z",
      lastUpdated: "2025-08-05T11:00:00Z",
      rejectedAt: "2025-08-05T11:00:00Z",
      companyName: "Test Company LLC",
      contactEmail: "test@company.com",
      rejectionReason: "Incomplete documentation",
      canReapply: true,
      reapplyDate: "2025-09-05",
      progress: 50,
      timeline: [
        {
          step: "Application Submitted",
          status: "completed",
          timestamp: "2025-08-04T09:00:00Z",
          description: "Your application has been received"
        },
        {
          step: "Document Verification",
          status: "failed",
          timestamp: "2025-08-05T11:00:00Z",
          description: "Missing required documents"
        },
        {
          step: "Credit Review",
          status: "cancelled",
          timestamp: null,
          description: "Not processed"
        },
        {
          step: "Final Decision",
          status: "cancelled",
          timestamp: null,
          description: "Application rejected"
        }
      ]
    }
  }
}

/**
 * @description Application status checker page
 * @fileoverview Public page for checking dealer application status
 */
export default function ApplicationStatusPage() {
  const params = useParams()
  const applicationId = params.applicationId as string
  const application = getApplicationStatus(applicationId)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />
      case 'reviewing':
        return <Clock className="h-6 w-6 text-blue-600" />
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="text-lg px-4 py-1">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="text-lg px-4 py-1">Rejected</Badge>
      case 'reviewing':
        return <Badge variant="default" className="text-lg px-4 py-1">Under Review</Badge>
      default:
        return <Badge variant="secondary" className="text-lg px-4 py-1">Pending Review</Badge>
    }
  }

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <Home className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Status</h1>
          <p className="text-gray-600">Track the progress of your dealer application</p>
        </div>

        {/* Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(application.status)}
                <div>
                  <CardTitle className="text-xl">Application {application.id}</CardTitle>
                  <CardDescription>{application.companyName}</CardDescription>
                </div>
              </div>
              {getStatusBadge(application.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{application.progress}%</span>
                </div>
                <Progress value={application.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{new Date(application.lastUpdated).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {application.status === 'pending' ? 'Estimated Review Time' : 
                     application.status === 'approved' ? 'Approved On' : 'Decision Date'}
                  </p>
                  <p className="font-medium">
                    {application.status === 'pending' ? application.estimatedReviewTime :
                     application.status === 'approved' ? new Date(application.approvedAt || '').toLocaleDateString() :
                     new Date(application.rejectedAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status-specific Alerts */}
        {application.status === 'pending' && (
          <AlertWithIcon
            variant="info"
            title="Application Under Review"
            description={`Your application is being reviewed by our team. We'll notify you at ${application.contactEmail} once a decision has been made.`}
            className="mb-8"
          />
        )}

        {application.status === 'approved' && (
          <div className="space-y-4 mb-8">
            <AlertWithIcon
              variant="success"
              title="Congratulations! Your Application Has Been Approved"
              description="Welcome to our dealer network! Your account has been created and you can now access the B2B portal."
            />
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Account Number</dt>
                    <dd className="mt-1 font-mono font-medium">{application.accountNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Approved Credit Limit</dt>
                    <dd className="mt-1 font-medium">${application.approvedCreditLimit?.toLocaleString()}</dd>
                  </div>
                </dl>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <Link href={`/welcome/${application.accountNumber}`}>
                      Access Welcome Kit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/login">
                      Login to Portal
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {application.status === 'rejected' && (
          <div className="space-y-4 mb-8">
            <AlertWithIcon
              variant="destructive"
              title="Application Not Approved"
              description={`Reason: ${application.rejectionReason}`}
            />
            
            {application.canReapply && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg">You Can Reapply</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    You're eligible to submit a new application starting {new Date(application.reapplyDate).toLocaleDateString()}.
                    Please ensure all required documents are complete before reapplying.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/apply">
                      <Calendar className="mr-2 h-4 w-4" />
                      Set Reminder
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
            <CardDescription>Track each step of your application process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {application.timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {getTimelineIcon(item.status)}
                    {index < application.timeline.length - 1 && (
                      <div className={`w-0.5 h-16 mt-2 ${
                        item.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{item.step}</h3>
                      {item.status === 'in-progress' && (
                        <Badge variant="default" className="text-xs">In Progress</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    {item.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Our team is here to assist you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <a href="tel:8005550123">
                  <Phone className="mr-2 h-4 w-4" />
                  (800) 555-0123
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="mailto:newaccounts@company.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </a>
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Live Chat
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Business Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM EST
                <br />
                <strong>Application ID:</strong> {application.id}
                <br />
                Keep this ID handy when contacting support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          {application.status !== 'rejected' && (
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Status Report
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}