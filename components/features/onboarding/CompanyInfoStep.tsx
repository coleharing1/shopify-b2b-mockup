"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface CompanyInfoData {
  businessName: string
  dba?: string
  ein: string
  businessType: string
  yearEstablished: string
  website?: string
  physicalAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  billingAddress: {
    sameAsPhysical: boolean
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  primaryContact: {
    firstName: string
    lastName: string
    title: string
    email: string
    phone: string
  }
  accountsPayableContact: {
    sameAsPrimary: boolean
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
}

interface CompanyInfoStepProps {
  data: Partial<CompanyInfoData>
  onChange: (data: Partial<CompanyInfoData>) => void
  errors?: Record<string, string>
}

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
]

/**
 * @description Company information form step
 * @fileoverview Collects business details for dealer application
 */
export function CompanyInfoStep({ data, onChange, errors = {} }: CompanyInfoStepProps) {
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

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Legal Business Name *</Label>
            <Input
              id="businessName"
              value={getValue('businessName')}
              onChange={(e) => updateField('businessName', e.target.value)}
              className={cn(errors.businessName && "border-red-300")}
            />
            {errors.businessName && (
              <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dba">DBA (if different)</Label>
            <Input
              id="dba"
              value={getValue('dba')}
              onChange={(e) => updateField('dba', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="ein">EIN/Tax ID *</Label>
            <Input
              id="ein"
              placeholder="12-3456789"
              value={getValue('ein')}
              onChange={(e) => updateField('ein', e.target.value)}
              className={cn(errors.ein && "border-red-300")}
            />
            {errors.ein && (
              <p className="text-sm text-red-600 mt-1">{errors.ein}</p>
            )}
          </div>

          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              value={getValue('businessType')}
              onValueChange={(value) => updateField('businessType', value)}
            >
              <SelectTrigger className={cn(errors.businessType && "border-red-300")}>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LLC">LLC</SelectItem>
                <SelectItem value="Corporation">Corporation</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
              </SelectContent>
            </Select>
            {errors.businessType && (
              <p className="text-sm text-red-600 mt-1">{errors.businessType}</p>
            )}
          </div>

          <div>
            <Label htmlFor="yearEstablished">Year Established *</Label>
            <Input
              id="yearEstablished"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={getValue('yearEstablished')}
              onChange={(e) => updateField('yearEstablished', e.target.value)}
              className={cn(errors.yearEstablished && "border-red-300")}
            />
            {errors.yearEstablished && (
              <p className="text-sm text-red-600 mt-1">{errors.yearEstablished}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="www.example.com"
              value={getValue('website')}
              onChange={(e) => updateField('website', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Physical Address */}
      <div>
        <h3 className="text-lg font-medium mb-4">Physical Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="physicalStreet">Street Address *</Label>
            <Input
              id="physicalStreet"
              value={getValue('physicalAddress.street')}
              onChange={(e) => updateField('physicalAddress.street', e.target.value)}
              className={cn(errors['physicalAddress.street'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="physicalCity">City *</Label>
            <Input
              id="physicalCity"
              value={getValue('physicalAddress.city')}
              onChange={(e) => updateField('physicalAddress.city', e.target.value)}
              className={cn(errors['physicalAddress.city'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="physicalState">State *</Label>
            <Select
              value={getValue('physicalAddress.state')}
              onValueChange={(value) => updateField('physicalAddress.state', value)}
            >
              <SelectTrigger className={cn(errors['physicalAddress.state'] && "border-red-300")}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map(state => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="physicalZip">ZIP Code *</Label>
            <Input
              id="physicalZip"
              value={getValue('physicalAddress.zip')}
              onChange={(e) => updateField('physicalAddress.zip', e.target.value)}
              className={cn(errors['physicalAddress.zip'] && "border-red-300")}
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Billing Address</h3>
          <Checkbox
            id="sameAsPhysical"
            label="Same as physical address"
            checked={getValue('billingAddress.sameAsPhysical') === true}
            onChange={(e) => updateField('billingAddress.sameAsPhysical', e.target.checked)}
          />
        </div>
        
        {!getValue('billingAddress.sameAsPhysical') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="billingStreet">Street Address *</Label>
              <Input
                id="billingStreet"
                value={getValue('billingAddress.street')}
                onChange={(e) => updateField('billingAddress.street', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="billingCity">City *</Label>
              <Input
                id="billingCity"
                value={getValue('billingAddress.city')}
                onChange={(e) => updateField('billingAddress.city', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="billingState">State *</Label>
              <Select
                value={getValue('billingAddress.state')}
                onValueChange={(value) => updateField('billingAddress.state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="billingZip">ZIP Code *</Label>
              <Input
                id="billingZip"
                value={getValue('billingAddress.zip')}
                onChange={(e) => updateField('billingAddress.zip', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Primary Contact */}
      <div>
        <h3 className="text-lg font-medium mb-4">Primary Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryFirstName">First Name *</Label>
            <Input
              id="primaryFirstName"
              value={getValue('primaryContact.firstName')}
              onChange={(e) => updateField('primaryContact.firstName', e.target.value)}
              className={cn(errors['primaryContact.firstName'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="primaryLastName">Last Name *</Label>
            <Input
              id="primaryLastName"
              value={getValue('primaryContact.lastName')}
              onChange={(e) => updateField('primaryContact.lastName', e.target.value)}
              className={cn(errors['primaryContact.lastName'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="primaryTitle">Title *</Label>
            <Input
              id="primaryTitle"
              value={getValue('primaryContact.title')}
              onChange={(e) => updateField('primaryContact.title', e.target.value)}
              className={cn(errors['primaryContact.title'] && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor="primaryEmail">Email *</Label>
            <Input
              id="primaryEmail"
              type="email"
              value={getValue('primaryContact.email')}
              onChange={(e) => updateField('primaryContact.email', e.target.value)}
              className={cn(errors['primaryContact.email'] && "border-red-300")}
            />
            {errors['primaryContact.email'] && (
              <p className="text-sm text-red-600 mt-1">{errors['primaryContact.email']}</p>
            )}
          </div>

          <div>
            <Label htmlFor="primaryPhone">Phone *</Label>
            <Input
              id="primaryPhone"
              type="tel"
              placeholder="555-555-5555"
              value={getValue('primaryContact.phone')}
              onChange={(e) => updateField('primaryContact.phone', e.target.value)}
              className={cn(errors['primaryContact.phone'] && "border-red-300")}
            />
          </div>
        </div>
      </div>

      {/* Accounts Payable Contact */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Accounts Payable Contact</h3>
          <Checkbox
            id="sameAsPrimary"
            label="Same as primary contact"
            checked={getValue('accountsPayableContact.sameAsPrimary') === true}
            onChange={(e) => updateField('accountsPayableContact.sameAsPrimary', e.target.checked)}
          />
        </div>

        {!getValue('accountsPayableContact.sameAsPrimary') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apFirstName">First Name *</Label>
              <Input
                id="apFirstName"
                value={getValue('accountsPayableContact.firstName')}
                onChange={(e) => updateField('accountsPayableContact.firstName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="apLastName">Last Name *</Label>
              <Input
                id="apLastName"
                value={getValue('accountsPayableContact.lastName')}
                onChange={(e) => updateField('accountsPayableContact.lastName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="apEmail">Email *</Label>
              <Input
                id="apEmail"
                type="email"
                value={getValue('accountsPayableContact.email')}
                onChange={(e) => updateField('accountsPayableContact.email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="apPhone">Phone *</Label>
              <Input
                id="apPhone"
                type="tel"
                placeholder="555-555-5555"
                value={getValue('accountsPayableContact.phone')}
                onChange={(e) => updateField('accountsPayableContact.phone', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}