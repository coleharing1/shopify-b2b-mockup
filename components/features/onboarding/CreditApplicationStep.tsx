"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertWithIcon } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, CreditCard, Building } from "lucide-react"
import { cn } from "@/lib/utils"

interface BankingInfo {
  bankName: string
  accountName: string
  accountNumber: string
  routingNumber: string
}

interface TradeReference {
  companyName: string
  contactName: string
  phone: string
  email: string
}

interface CreditApplicationData {
  requestCredit: boolean
  creditAmount?: string
  bankingInfo?: BankingInfo
  tradeReferences?: TradeReference[]
  authorizedSignature?: {
    name: string
    title: string
    date: string
    agreed: boolean
  }
}

interface CreditApplicationStepProps {
  data: Partial<CreditApplicationData>
  onChange: (data: Partial<CreditApplicationData>) => void
  errors?: Record<string, string>
}

/**
 * @description Optional credit application form step
 * @fileoverview Allows dealers to apply for NET payment terms
 */
export function CreditApplicationStep({ data, onChange, errors = {} }: CreditApplicationStepProps) {
  const [tradeReferences, setTradeReferences] = useState<TradeReference[]>(
    data.tradeReferences || [
      { companyName: "", contactName: "", phone: "", email: "" }
    ]
  )

  const updateField = (field: string, value: any) => {
    const keys = field.split('.')
    const updated = { ...data }
    let current: any = updated
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    onChange(updated)
  }

  const getValue = (field: string) => {
    const keys = field.split('.')
    let current: any = data
    
    for (const key of keys) {
      current = current?.[key]
    }
    
    return current || ''
  }

  const addTradeReference = () => {
    const newReferences = [...tradeReferences, { companyName: "", contactName: "", phone: "", email: "" }]
    setTradeReferences(newReferences)
    updateField('tradeReferences', newReferences)
  }

  const removeTradeReference = (index: number) => {
    const newReferences = tradeReferences.filter((_, i) => i !== index)
    setTradeReferences(newReferences)
    updateField('tradeReferences', newReferences)
  }

  const updateTradeReference = (index: number, field: string, value: string) => {
    const newReferences = [...tradeReferences]
    newReferences[index] = { ...newReferences[index], [field]: value }
    setTradeReferences(newReferences)
    updateField('tradeReferences', newReferences)
  }

  if (!data.requestCredit) {
    return (
      <div className="space-y-6">
        <AlertWithIcon
          variant="info"
          title="Credit Application (Optional)"
          description="Apply for NET payment terms to purchase on account instead of paying by credit card."
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Terms Options
            </CardTitle>
            <CardDescription>
              Choose how you'd like to pay for your orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={data.requestCredit ? "credit" : "card"}
              onValueChange={(value) => updateField('requestCredit', value === 'credit')}
            >
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <RadioGroupItem value="card" className="mt-0.5" />
                  <div>
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-gray-600">Pay immediately with credit card. No application needed.</p>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <RadioGroupItem value="credit" className="mt-0.5" />
                  <div>
                    <p className="font-medium">NET Terms (30/60/90 days)</p>
                    <p className="text-sm text-gray-600">Apply for credit to pay invoices later. Requires approval.</p>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AlertWithIcon
        variant="info"
        title="Credit Application"
        description="Complete this form to apply for NET payment terms. Approval typically takes 1-2 business days."
      />

      {/* Credit Amount */}
      <div>
        <h3 className="text-lg font-medium mb-4">Credit Request</h3>
        <div className="max-w-md">
          <Label htmlFor="creditAmount">Requested Credit Limit *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="creditAmount"
              type="number"
              min="0"
              step="1000"
              placeholder="10,000"
              value={getValue('creditAmount')}
              onChange={(e) => updateField('creditAmount', e.target.value)}
              className={cn("pl-8", errors.creditAmount && "border-red-300")}
            />
          </div>
          {errors.creditAmount && (
            <p className="text-sm text-red-600 mt-1">{errors.creditAmount}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">Typical limits range from $5,000 to $50,000</p>
        </div>
      </div>

      {/* Banking Information */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Building className="h-5 w-5" />
          Banking Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              value={getValue('bankingInfo.bankName')}
              onChange={(e) => updateField('bankingInfo.bankName', e.target.value)}
              className={cn(errors['bankingInfo.bankName'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              value={getValue('bankingInfo.accountName')}
              onChange={(e) => updateField('bankingInfo.accountName', e.target.value)}
              className={cn(errors['bankingInfo.accountName'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number (Last 4 digits) *</Label>
            <Input
              id="accountNumber"
              placeholder="****1234"
              maxLength={4}
              value={getValue('bankingInfo.accountNumber')}
              onChange={(e) => updateField('bankingInfo.accountNumber', e.target.value)}
              className={cn(errors['bankingInfo.accountNumber'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="routingNumber">Routing Number *</Label>
            <Input
              id="routingNumber"
              placeholder="123456789"
              maxLength={9}
              value={getValue('bankingInfo.routingNumber')}
              onChange={(e) => updateField('bankingInfo.routingNumber', e.target.value)}
              className={cn(errors['bankingInfo.routingNumber'] && "border-red-300")}
            />
          </div>
        </div>
      </div>

      {/* Trade References */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Trade References</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTradeReference}
            disabled={tradeReferences.length >= 5}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Reference
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Please provide at least 3 trade references. These should be suppliers you have NET terms with.
        </p>

        <div className="space-y-4">
          {tradeReferences.map((ref, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Reference {index + 1}</CardTitle>
                  {tradeReferences.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTradeReference(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`company-${index}`}>Company Name *</Label>
                    <Input
                      id={`company-${index}`}
                      value={ref.companyName}
                      onChange={(e) => updateTradeReference(index, 'companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`contact-${index}`}>Contact Name</Label>
                    <Input
                      id={`contact-${index}`}
                      value={ref.contactName}
                      onChange={(e) => updateTradeReference(index, 'contactName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`phone-${index}`}>Phone *</Label>
                    <Input
                      id={`phone-${index}`}
                      type="tel"
                      value={ref.phone}
                      onChange={(e) => updateTradeReference(index, 'phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`email-${index}`}>Email</Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={ref.email}
                      onChange={(e) => updateTradeReference(index, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {errors.tradeReferences && (
          <p className="text-sm text-red-600 mt-2">{errors.tradeReferences}</p>
        )}
      </div>

      {/* Authorization */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Credit Authorization</CardTitle>
          <CardDescription>
            By submitting this application, you authorize us to verify the information provided
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signerName">Authorized Signer Name *</Label>
                <Input
                  id="signerName"
                  value={getValue('authorizedSignature.name')}
                  onChange={(e) => updateField('authorizedSignature.name', e.target.value)}
                  className={cn(errors['authorizedSignature.name'] && "border-red-300")}
                />
              </div>
              <div>
                <Label htmlFor="signerTitle">Title *</Label>
                <Input
                  id="signerTitle"
                  value={getValue('authorizedSignature.title')}
                  onChange={(e) => updateField('authorizedSignature.title', e.target.value)}
                  className={cn(errors['authorizedSignature.title'] && "border-red-300")}
                />
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="creditTerms"
                checked={getValue('authorizedSignature.agreed') === true}
                onChange={(e) => updateField('authorizedSignature.agreed', e.target.checked)}
              />
              <label htmlFor="creditTerms" className="text-sm leading-relaxed cursor-pointer">
                I certify that I am authorized to submit this credit application on behalf of the company.
                I understand that credit approval is subject to verification of the information provided
                and that personal guarantees may be required.
              </label>
            </div>

            {errors['authorizedSignature.agreed'] && (
              <p className="text-sm text-red-600">{errors['authorizedSignature.agreed']}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}