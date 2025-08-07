"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressSteps, MobileProgressSteps } from "@/components/ui/progress-steps"
import { CompanyInfoStep } from "@/components/features/onboarding/CompanyInfoStep"
import { DocumentUploadStep } from "@/components/features/onboarding/DocumentUploadStep"
import { AlertWithIcon } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { id: 1, title: "Company Info", description: "Basic business details" },
  { id: 2, title: "Documents", description: "Required certificates" },
  { id: 3, title: "Credit Application", description: "Optional NET terms" },
  { id: 4, title: "Review & Submit", description: "Final confirmation" }
]

/**
 * @description Multi-step dealer application form
 * @fileoverview Public-facing application wizard for new dealers
 */
export default function ApplyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSavedMessage, setShowSavedMessage] = useState(false)
  
  // Form data state
  const [formData, setFormData] = useState({
    companyInfo: {
      billingAddress: { sameAsPhysical: true },
      accountsPayableContact: { sameAsPrimary: true }
    },
    documents: {},
    creditApplication: {
      requestCredit: false
    }
  })
  
  const [errors, setErrors] = useState<Record<string, any>>({})

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('dealer-application-draft')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to load saved draft')
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('dealer-application-draft', JSON.stringify(formData))
      setShowSavedMessage(true)
      setTimeout(() => setShowSavedMessage(false), 2000)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [formData])

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, any> = {}
    
    if (step === 1) {
      // Company info validation
      const info = formData.companyInfo as any
      if (!info.businessName) newErrors.businessName = "Business name is required"
      if (!info.ein) newErrors.ein = "EIN/Tax ID is required"
      if (info.ein && !/^\d{2}-\d{7}$/.test(info.ein)) {
        newErrors.ein = "EIN must be in format: 12-3456789"
      }
      if (!info.businessType) newErrors.businessType = "Business type is required"
      if (!info.yearEstablished) newErrors.yearEstablished = "Year established is required"
      
      // Address validation
      if (!info.physicalAddress?.street) newErrors['physicalAddress.street'] = "Street address is required"
      if (!info.physicalAddress?.city) newErrors['physicalAddress.city'] = "City is required"
      if (!info.physicalAddress?.state) newErrors['physicalAddress.state'] = "State is required"
      if (!info.physicalAddress?.zip) newErrors['physicalAddress.zip'] = "ZIP code is required"
      
      // Contact validation
      if (!info.primaryContact?.firstName) newErrors['primaryContact.firstName'] = "First name is required"
      if (!info.primaryContact?.lastName) newErrors['primaryContact.lastName'] = "Last name is required"
      if (!info.primaryContact?.title) newErrors['primaryContact.title'] = "Title is required"
      if (!info.primaryContact?.email) newErrors['primaryContact.email'] = "Email is required"
      if (info.primaryContact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.primaryContact.email)) {
        newErrors['primaryContact.email'] = "Invalid email format"
      }
      if (!info.primaryContact?.phone) newErrors['primaryContact.phone'] = "Phone is required"
    }
    
    if (step === 2) {
      // Document validation
      const docs = formData.documents as any
      if (!docs['resale-certificate']?.file) {
        newErrors['resale-certificate'] = "Resale certificate is required"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return
    
    setIsSubmitting(true)
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear draft and redirect
    localStorage.removeItem('dealer-application-draft')
    router.push('/apply/submitted')
  }

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            {showSavedMessage && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Save className="h-4 w-4" />
                <span>Draft saved</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for a Dealer Account</h1>
          <p className="mt-2 text-gray-600">
            Complete the application below to become an authorized dealer
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="hidden md:block">
            <ProgressSteps steps={STEPS} currentStep={currentStep} />
          </div>
          <div className="md:hidden">
            <MobileProgressSteps steps={STEPS} currentStep={currentStep} />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step Content */}
            {currentStep === 1 && (
              <CompanyInfoStep
                data={formData.companyInfo}
                onChange={(data) => updateFormData('companyInfo', data)}
                errors={errors}
              />
            )}
            
            {currentStep === 2 && (
              <DocumentUploadStep
                documents={formData.documents}
                onChange={(docs) => updateFormData('documents', docs)}
                errors={errors}
              />
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <AlertWithIcon
                  variant="info"
                  title="Optional Credit Application"
                  description="Apply for NET payment terms to purchase on account. You can skip this step and pay by credit card."
                />
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Credit application form would go here</p>
                  <Button variant="outline" onClick={() => setCurrentStep(4)}>
                    Skip for Now
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-6">
                <AlertWithIcon
                  variant="success"
                  title="Ready to Submit"
                  description="Please review your application before submitting. You'll receive a confirmation email with your application ID."
                />
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium mb-4">Application Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Business Name:</strong> {(formData.companyInfo as any).businessName || 'Not provided'}</p>
                    <p><strong>EIN:</strong> {(formData.companyInfo as any).ein || 'Not provided'}</p>
                    <p><strong>Contact:</strong> {(formData.companyInfo as any).primaryContact?.email || 'Not provided'}</p>
                    <p><strong>Documents:</strong> {Object.keys(formData.documents).length} uploaded</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < STEPS.length ? (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? Contact us at (800) 555-0123 or support@company.com</p>
        </div>
      </div>
    </div>
  )
}