"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertWithIcon } from "@/components/ui/alert"
import { 
  CheckCircle, 
  Download, 
  FileText, 
  BookOpen,
  Video,
  Calendar,
  Phone,
  Mail,
  Users,
  ShoppingBag,
  TrendingUp,
  Gift,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PlayCircle,
  Clock,
  Award,
  Package,
  CreditCard,
  Truck,
  BarChart
} from "lucide-react"

// Mock welcome kit data
const getWelcomeKitData = (companyId: string) => {
  return {
    companyId: companyId,
    companyName: "Outdoor Adventures LLC",
    accountNumber: "ACC-2025-1234",
    creditLimit: 35000,
    paymentTerms: "NET 30",
    salesRep: {
      name: "Sarah Johnson",
      title: "Territory Sales Manager",
      email: "sarah.johnson@company.com",
      phone: "(555) 123-4567",
      photo: "/api/placeholder/100/100"
    },
    documents: [
      {
        id: 1,
        title: "Dealer Agreement",
        description: "Your signed dealer agreement and terms",
        type: "pdf",
        size: "2.4 MB",
        status: "ready"
      },
      {
        id: 2,
        title: "2025 Product Catalog",
        description: "Complete product catalog with wholesale pricing",
        type: "pdf",
        size: "18.5 MB",
        status: "ready"
      },
      {
        id: 3,
        title: "Marketing Assets",
        description: "Logos, banners, and promotional materials",
        type: "zip",
        size: "125 MB",
        status: "ready"
      },
      {
        id: 4,
        title: "B2B Portal Guide",
        description: "Step-by-step guide to using the dealer portal",
        type: "pdf",
        size: "5.2 MB",
        status: "ready"
      },
      {
        id: 5,
        title: "Price List",
        description: "Your personalized wholesale price list",
        type: "xlsx",
        size: "1.8 MB",
        status: "generating",
        eta: "2 minutes"
      }
    ],
    training: [
      {
        id: 1,
        title: "Welcome to Our Dealer Network",
        duration: "15 min",
        type: "video",
        thumbnail: "/api/placeholder/300/200"
      },
      {
        id: 2,
        title: "Product Training Series",
        duration: "45 min",
        type: "course",
        modules: 6
      },
      {
        id: 3,
        title: "B2B Portal Walkthrough",
        duration: "20 min",
        type: "video",
        thumbnail: "/api/placeholder/300/200"
      }
    ],
    nextSteps: [
      {
        title: "Complete Your Profile",
        description: "Add your business logo and store information",
        completed: false,
        link: "/retailer/settings/profile"
      },
      {
        title: "Place Your Opening Order",
        description: "Get 10% off your first order with code WELCOME10",
        completed: false,
        link: "/retailer/products"
      },
      {
        title: "Schedule Training Call",
        description: "Book a 30-minute onboarding call with your sales rep",
        completed: false,
        link: "#schedule"
      },
      {
        title: "Set Up Payment Method",
        description: "Add your payment information for seamless ordering",
        completed: false,
        link: "/retailer/settings/billing"
      }
    ],
    benefits: [
      {
        icon: TrendingUp,
        title: "Tiered Pricing",
        description: "Unlock better pricing as your volume grows"
      },
      {
        icon: Truck,
        title: "Free Shipping",
        description: "On orders over $500"
      },
      {
        icon: Gift,
        title: "Exclusive Access",
        description: "First look at new products and limited editions"
      },
      {
        icon: Users,
        title: "Marketing Support",
        description: "Co-op advertising and promotional materials"
      }
    ]
  }
}

/**
 * @description Welcome kit page for newly approved dealers
 * @fileoverview Post-approval onboarding experience with resources
 */
export default function WelcomeKitPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string
  const welcomeData = getWelcomeKitData(companyId)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [downloadingFiles, setDownloadingFiles] = useState<number[]>([])

  const handleDownload = (fileId: number) => {
    setDownloadingFiles([...downloadingFiles, fileId])
    // Simulate download
    setTimeout(() => {
      setDownloadingFiles(downloadingFiles.filter(id => id !== fileId))
    }, 2000)
  }

  const handleDownloadAll = () => {
    const readyDocs = welcomeData.documents.filter(doc => doc.status === 'ready')
    readyDocs.forEach(doc => handleDownload(doc.id))
  }

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index))
    } else {
      setCompletedSteps([...completedSteps, index])
    }
  }

  const progressPercentage = (completedSteps.length / welcomeData.nextSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Dealer Network!</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Congratulations {welcomeData.companyName}! We're excited to have you as our newest authorized dealer.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Account Summary */}
        <Card className="mb-8 border-2 border-primary-light">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Account is Ready!</CardTitle>
                <CardDescription>Here are your account details</CardDescription>
              </div>
              <Award className="h-12 w-12 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="font-mono font-medium text-lg">{welcomeData.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                <p className="font-medium text-lg">${welcomeData.creditLimit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Terms</p>
                <p className="font-medium text-lg">{welcomeData.paymentTerms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Onboarding Progress</p>
                <div className="mt-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{completedSteps.length} of {welcomeData.nextSteps.length} completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Getting Started Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Getting Started Checklist
                </CardTitle>
                <CardDescription>Complete these steps to get the most from your dealer account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {welcomeData.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(index)}
                        className={`mt-0.5 h-5 w-5 rounded-full border-2 transition-colors ${
                          completedSteps.includes(index) 
                            ? 'bg-primary border-primary' 
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {completedSteps.includes(index) && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-medium ${completedSteps.includes(index) ? 'line-through text-gray-400' : ''}`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        {!completedSteps.includes(index) && (
                          <Button asChild variant="link" size="sm" className="p-0 h-auto mt-2">
                            <Link href={step.link}>
                              Get Started <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Downloadable Resources */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Your Welcome Package
                    </CardTitle>
                    <CardDescription>Important documents and resources</CardDescription>
                  </div>
                  <Button onClick={handleDownloadAll} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {welcomeData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-gray-600">{doc.description} • {doc.size}</p>
                        </div>
                      </div>
                      <div>
                        {doc.status === 'ready' ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(doc.id)}
                            disabled={downloadingFiles.includes(doc.id)}
                          >
                            {downloadingFiles.includes(doc.id) ? (
                              <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 animate-spin" />
                            {doc.eta}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Training Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Training & Education
                </CardTitle>
                <CardDescription>Learn about our products and best practices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {welcomeData.training.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      {item.thumbnail && (
                        <div className="relative aspect-video bg-gray-100">
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <PlayCircle className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {item.type === 'video' && <Video className="h-4 w-4" />}
                          {item.type === 'course' && <BookOpen className="h-4 w-4" />}
                          <span>{item.duration}</span>
                          {item.modules && <span>• {item.modules} modules</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Sales Rep Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Sales Representative</CardTitle>
                <CardDescription>Here to help you succeed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                  <h3 className="font-medium text-lg">{welcomeData.salesRep.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{welcomeData.salesRep.title}</p>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`mailto:${welcomeData.salesRep.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        {welcomeData.salesRep.email}
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`tel:${welcomeData.salesRep.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {welcomeData.salesRep.phone}
                      </a>
                    </Button>
                    <Button className="w-full" id="schedule">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Onboarding Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Dealer Benefits</CardTitle>
                <CardDescription>Exclusive perks for our partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {welcomeData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                          <benefit.icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{benefit.title}</h4>
                        <p className="text-xs text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-primary-light to-primary-lighter border-primary">
              <CardHeader>
                <CardTitle>Ready to Start?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/retailer/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Browse Products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/retailer/dashboard">
                    <BarChart className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Special Offer */}
            <AlertWithIcon
              variant="success"
              title="Welcome Offer!"
              description="Use code WELCOME10 for 10% off your first order. Valid for 30 days."
            />
          </div>
        </div>
      </div>
    </div>
  )
}