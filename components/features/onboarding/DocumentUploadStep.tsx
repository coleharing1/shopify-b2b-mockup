"use client"

import { FileUpload } from "@/components/ui/file-upload"
import { AlertWithIcon } from "@/components/ui/alert"

interface Document {
  type: string
  file: File | null
  required: boolean
  description: string
}

interface DocumentUploadStepProps {
  documents: Record<string, Document>
  onChange: (documents: Record<string, Document>) => void
  errors?: Record<string, string>
}

/**
 * @description Document upload form step
 * @fileoverview Handles required business documents for application
 */
export function DocumentUploadStep({ documents, onChange, errors = {} }: DocumentUploadStepProps) {
  const handleFileUpload = (type: string, file: File) => {
    onChange({
      ...documents,
      [type]: {
        ...documents[type],
        file
      }
    })
  }

  const handleFileRemove = (type: string) => {
    onChange({
      ...documents,
      [type]: {
        ...documents[type],
        file: null
      }
    })
  }

  const documentTypes = [
    {
      type: 'resale-certificate',
      label: 'Resale/Tax Exemption Certificate',
      required: true,
      description: 'Valid resale certificate for your state. Must be current and not expired.',
      accept: '.pdf,.jpg,.jpeg,.png'
    },
    {
      type: 'business-license',
      label: 'Business License',
      required: false,
      description: 'Current business license or registration certificate.',
      accept: '.pdf,.jpg,.jpeg,.png'
    },
    {
      type: 'w9',
      label: 'W-9 Form',
      required: false,
      description: 'Completed W-9 for tax purposes (US businesses only).',
      accept: '.pdf'
    },
    {
      type: 'certificate-of-insurance',
      label: 'Certificate of Insurance',
      required: false,
      description: 'General liability insurance certificate if available.',
      accept: '.pdf'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Required Documents</h3>
        <p className="text-sm text-gray-600 mb-6">
          Please upload the following documents to complete your application. 
          All documents must be clear, legible, and current.
        </p>
      </div>

      <AlertWithIcon
        variant="info"
        title="Document Requirements"
        description="Files must be in PDF, JPG, or PNG format and less than 10MB each. Ensure all documents are current and clearly readable."
      />

      <div className="space-y-6">
        {documentTypes.map((docType) => {
          const doc = documents[docType.type] || { 
            type: docType.type, 
            file: null, 
            required: docType.required,
            description: docType.description
          }

          return (
            <div key={docType.type}>
              <FileUpload
                label={docType.label}
                description={docType.description}
                required={docType.required}
                accept={docType.accept}
                value={doc.file}
                onUpload={(file) => handleFileUpload(docType.type, file)}
                onRemove={() => handleFileRemove(docType.type)}
              />
              {errors[docType.type] && (
                <p className="text-sm text-red-600 mt-1">{errors[docType.type]}</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Important Notes:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Resale certificates must be valid for the state where you'll be taking delivery</li>
          <li>Multi-state certificates are accepted if properly completed</li>
          <li>Expired documents will delay your application</li>
          <li>All documents are stored securely and only used for verification</li>
        </ul>
      </div>
    </div>
  )
}