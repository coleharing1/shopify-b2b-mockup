"use client"

import { AlertWithIcon } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Building, 
  User, 
  FileText, 
  CreditCard, 
  Edit2, 
  CheckCircle,
  AlertCircle 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewSubmitStepProps {
  formData: any
  onEdit: (step: number) => void
  errors?: Record<string, string>
}

/**
 * @description Final review and submission step
 * @fileoverview Displays application summary with edit capabilities
 */
export function ReviewSubmitStep({ formData, onEdit, errors = {} }: ReviewSubmitStepProps) {
  const getSectionStatus = (section: string): { complete: boolean; message?: string } => {
    switch (section) {
      case 'companyInfo':
        const info = formData.companyInfo || {}
        const hasRequiredFields = info.businessName && info.ein && info.businessType && 
          info.physicalAddress?.street && info.primaryContact?.email
        return { 
          complete: hasRequiredFields,
          message: hasRequiredFields ? "All required information provided" : "Missing required fields"
        }
      
      case 'documents':
        const hasResaleCert = formData.documents?.['resale-certificate']?.file
        return { 
          complete: hasResaleCert,
          message: hasResaleCert ? "Required documents uploaded" : "Missing resale certificate"
        }
      
      case 'creditApplication':
        if (!formData.creditApplication?.requestCredit) {
          return { complete: true, message: "Paying by credit card" }
        }
        const hasCredit = formData.creditApplication?.creditAmount && 
          formData.creditApplication?.authorizedSignature?.agreed
        return { 
          complete: hasCredit,
          message: hasCredit ? "Credit application complete" : "Missing credit information"
        }
      
      default:
        return { complete: false }
    }
  }

  const allSectionsComplete = ['companyInfo', 'documents', 'creditApplication']
    .every(section => getSectionStatus(section).complete)

  return (
    <div className="space-y-6">
      <AlertWithIcon
        variant={allSectionsComplete ? "success" : "warning"}
        title={allSectionsComplete ? "Ready to Submit" : "Review Required"}
        description={
          allSectionsComplete 
            ? "Please review your application before submitting. You'll receive a confirmation email with your application ID."
            : "Please complete all required sections before submitting your application."
        }
      />

      {/* Company Information Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>Company Information</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getSectionStatus('companyInfo').complete ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>{getSectionStatus('companyInfo').message}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-600">Business Name</dt>
              <dd className="mt-1">{formData.companyInfo?.businessName || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">EIN</dt>
              <dd className="mt-1">{formData.companyInfo?.ein || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Business Type</dt>
              <dd className="mt-1">{formData.companyInfo?.businessType || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Year Established</dt>
              <dd className="mt-1">{formData.companyInfo?.yearEstablished || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Primary Contact</dt>
              <dd className="mt-1">
                {formData.companyInfo?.primaryContact?.firstName} {formData.companyInfo?.primaryContact?.lastName}
                <br />
                {formData.companyInfo?.primaryContact?.email}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Physical Address</dt>
              <dd className="mt-1">
                {formData.companyInfo?.physicalAddress?.street}
                <br />
                {formData.companyInfo?.physicalAddress?.city}, {formData.companyInfo?.physicalAddress?.state} {formData.companyInfo?.physicalAddress?.zip}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Documents Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Documents</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getSectionStatus('documents').complete ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>{getSectionStatus('documents').message}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formData.documents?.['resale-certificate']?.file ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Resale Certificate</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {formData.documents['resale-certificate'].file.name}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Resale Certificate</span>
                </div>
                <Badge variant="outline" className="text-red-600">Required</Badge>
              </div>
            )}
            
            {['business-license', 'w9', 'certificate-of-insurance'].map((docType) => {
              const doc = formData.documents?.[docType]
              if (doc?.file) {
                return (
                  <div key={docType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{docType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      {doc.file.name}
                    </Badge>
                  </div>
                )
              }
              return null
            })}
          </div>
        </CardContent>
      </Card>

      {/* Credit Application Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Payment Terms</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getSectionStatus('creditApplication').complete ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>{getSectionStatus('creditApplication').message}</CardDescription>
        </CardHeader>
        <CardContent>
          {formData.creditApplication?.requestCredit ? (
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-600">Requested Credit Limit</dt>
                <dd className="mt-1">${formData.creditApplication.creditAmount || '0'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-600">Banking Information</dt>
                <dd className="mt-1">
                  {formData.creditApplication.bankingInfo?.bankName || 'Not provided'}
                  {formData.creditApplication.bankingInfo?.accountNumber && 
                    ` (****${formData.creditApplication.bankingInfo.accountNumber})`}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-600">Trade References</dt>
                <dd className="mt-1">
                  {formData.creditApplication.tradeReferences?.length || 0} provided
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-600">Authorized By</dt>
                <dd className="mt-1">
                  {formData.creditApplication.authorizedSignature?.name || 'Not signed'} - 
                  {formData.creditApplication.authorizedSignature?.title || 'No title'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-600">Credit card payment selected</p>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="max-h-48 overflow-y-auto bg-white border rounded-lg p-4 text-sm text-gray-600">
              <h4 className="font-medium text-gray-900 mb-2">Dealer Agreement Terms</h4>
              <p className="mb-2">
                By submitting this application, you agree to the following terms and conditions:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>All information provided is accurate and complete</li>
                <li>You are authorized to enter into agreements on behalf of the company</li>
                <li>You agree to maintain a valid resale certificate</li>
                <li>You understand that approval is subject to verification</li>
                <li>You agree to the minimum order requirements</li>
                <li>You accept the standard payment terms</li>
                <li>You will comply with all MAP pricing policies</li>
                <li>You agree to the territory restrictions if applicable</li>
              </ul>
              <p className="mt-2">
                Full dealer agreement will be provided upon approval. This application does not guarantee acceptance
                into the dealer program. We reserve the right to approve or deny any application at our discretion.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeTerms"
                className={cn(errors.agreeTerms && "border-red-300")}
              />
              <label htmlFor="agreeTerms" className="text-sm leading-relaxed cursor-pointer">
                I have read and agree to the terms and conditions. I certify that all information
                provided in this application is true and complete to the best of my knowledge.
              </label>
            </div>

            {errors.agreeTerms && (
              <p className="text-sm text-red-600">{errors.agreeTerms}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {!allSectionsComplete && (
        <AlertWithIcon
          variant="destructive"
          title="Cannot Submit Application"
          description="Please complete all required sections before submitting your application."
        />
      )}
    </div>
  )
}