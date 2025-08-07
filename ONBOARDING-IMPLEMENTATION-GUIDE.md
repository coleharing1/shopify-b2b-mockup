# 📋 Retailer Onboarding Implementation Guide

This guide outlines the implementation of an automated retailer onboarding workflow as a high-fidelity mockup integrated into our existing B2B portal.

## 🎯 Overview

Transform the traditional paperwork-heavy dealer application process into a sleek, automated self-service experience. This feature will demonstrate a complete workflow from application → verification → approval → account activation.

## 📁 Project Structure

### New Routes & Pages

```
/app
├── /apply                       # Public application flow
│   ├── page.tsx                # Multi-step application wizard
│   ├── /submitted              
│   │   └── page.tsx           # Confirmation page
│   └── /status
│       └── /[applicationId]    
│           └── page.tsx       # Application status checker
├── /admin                      # Admin dashboard (new section)
│   ├── layout.tsx             # Admin-specific layout
│   ├── /applications          
│   │   ├── page.tsx          # Applications list/queue
│   │   └── /[id]             
│   │       └── page.tsx      # Application detail/review
│   └── /dashboard
│       └── page.tsx          # Admin metrics dashboard
└── /welcome
    └── /[companyId]          
        └── page.tsx          # Post-approval welcome kit
```

### New Components

```
/components
├── /features
│   └── /onboarding
│       ├── ApplicationWizard.tsx      # Main multi-step orchestrator
│       ├── CompanyInfoStep.tsx       # Step 1: Business details
│       ├── DocumentUploadStep.tsx    # Step 2: Required documents
│       ├── CreditApplicationStep.tsx # Step 3: Optional credit app
│       ├── ReviewSubmitStep.tsx      # Step 4: Review & submit
│       ├── ProgressIndicator.tsx     # Visual progress tracker
│       ├── FileUploadMock.tsx        # Mock file uploader
│       └── ApplicationStatusBadge.tsx # Status visualization
└── /ui
    ├── file-upload.tsx               # Reusable upload component
    └── progress-steps.tsx            # Reusable step indicator
```

## 🏗️ Implementation Phases

### Phase 1: Foundation & Documentation (Day 1)

1. **Update Project Documentation**
   - Add onboarding section to `MOCKUP-PAGES.md`
   - Update `KEY-FEATURES-EXPLAINED.md` with onboarding feature
   - Create mock data structure in `MOCK-DATA.md`

2. **Scaffold Route Structure**
   ```bash
   # Create all necessary directories and placeholder files
   mkdir -p app/apply/submitted app/apply/status/[applicationId]
   mkdir -p app/admin/applications/[id] app/admin/dashboard
   mkdir -p app/welcome/[companyId]
   mkdir -p components/features/onboarding
   ```

3. **Mock Data Setup**
   ```typescript
   // public/mockdata/applications.json
   {
     "applications": [
       {
         "id": "APP-2025-001",
         "status": "pending", // pending|reviewing|approved|rejected
         "companyInfo": { ... },
         "documents": [ ... ],
         "creditScore": 720,
         "submittedAt": "2025-08-01T10:00:00Z",
         "reviewedBy": null,
         "notes": []
       }
     ]
   }
   ```

### Phase 2: Public Application Flow (Days 2-3)

1. **Multi-Step Application Wizard**
   ```typescript
   // Core state management hook
   export function useApplicationWizard() {
     const [currentStep, setCurrentStep] = useState(1)
     const [formData, setFormData] = useState<ApplicationData>({})
     const [validation, setValidation] = useState<ValidationState>({})
     
     // Auto-save to localStorage
     useEffect(() => {
       localStorage.setItem('application-draft', JSON.stringify(formData))
     }, [formData])
     
     return { currentStep, formData, validation, ... }
   }
   ```

2. **Step Components**
   - Company Info: Business name, EIN, address, contacts
   - Documents: Resale certificate, business license uploads
   - Credit App: Optional path for NET terms
   - Review: Summary with edit capabilities

3. **Mock File Upload**
   ```typescript
   // Simulates file upload with progress
   const FileUploadMock = ({ onUpload, accept, label }) => {
     const [uploading, setUploading] = useState(false)
     const [progress, setProgress] = useState(0)
     
     const simulateUpload = (file: File) => {
       setUploading(true)
       // Fake progress animation
       const interval = setInterval(() => {
         setProgress(prev => {
           if (prev >= 100) {
             clearInterval(interval)
             onUpload(file)
             return 100
           }
           return prev + 10
         })
       }, 200)
     }
   }
   ```

### Phase 3: Admin Review Dashboard (Day 4)

1. **Applications Queue**
   - Filterable list (pending, approved, rejected)
   - Quick stats (pending count, avg processing time)
   - Search by company name or application ID
   - Bulk actions UI (approve/reject multiple)

2. **Application Detail View**
   - All submitted information display
   - Document preview cards
   - Credit check results (mocked)
   - Action buttons: Approve, Reject, Request Info
   - Internal notes section
   - Activity timeline

3. **Admin Metrics Dashboard**
   ```typescript
   // Mock metrics display
   const metrics = {
     totalApplications: 47,
     pendingReview: 8,
     avgApprovalTime: "1.5 days",
     approvalRate: "92%",
     recentActivity: [ ... ]
   }
   ```

### Phase 4: Post-Approval Experience (Day 5)

1. **Application Status Page**
   - Real-time status display (using mock data)
   - Progress visualization
   - Next steps guidance
   - Support contact info

2. **E-Signature Mock**
   - DocuSign-style interface
   - Multiple documents preview
   - "Sign" buttons that simulate signing
   - Completion confirmation

3. **Welcome Kit Page**
   ```typescript
   // Post-approval landing page
   const WelcomeKit = () => (
     <div>
       <h1>Welcome to Our Dealer Network!</h1>
       <DownloadableResources>
         - Personalized Price Sheet (PDF)
         - Product Catalog (PDF)
         - Marketing Assets (ZIP)
         - Dealer Agreement (Signed PDF)
       </DownloadableResources>
       <NextSteps>
         - Access your B2B portal
         - Place your opening order
         - Schedule training call
       </NextSteps>
     </div>
   )
   ```

## 🎨 UI/UX Considerations

### Design Patterns
- Use existing design system (colors, spacing, components)
- Mobile-first responsive design
- Clear error states and validation messages
- Progress persistence (save draft functionality)
- Accessibility (ARIA labels, keyboard navigation)

### Visual Feedback
- Loading states during "processing"
- Success animations on step completion
- Clear status indicators (badges, colors)
- Helpful tooltips for complex fields

## 🔄 Integration Points

### With Existing Portal
1. **Login Page**: Add "Apply for Account" link
2. **Navigation**: Add admin section for approved admins
3. **Dashboard**: Show onboarding metrics for sales reps
4. **Notifications**: Mock alerts for new applications

### Mock Automations
```typescript
// Simulate automated workflows
const mockAutomations = {
  creditCheck: async (ein: string) => {
    await delay(2000) // Simulate API call
    return { score: 650 + Math.random() * 150, risk: 'low' }
  },
  
  sendWelcomeEmail: async (email: string) => {
    console.log(`Welcome email sent to ${email}`)
    return { sent: true, messageId: 'MSG-123' }
  },
  
  createB2BAccount: async (companyData: any) => {
    return { 
      accountId: `ACC-${Date.now()}`,
      portalUrl: '/retailer/dashboard'
    }
  }
}
```

## 📊 Success Metrics Display

Create visual representations of:
- Applications by status (pie chart)
- Weekly application trends (line graph)
- Average processing time (metric card)
- Conversion funnel (submitted → approved → ordered)

## 🚦 Implementation Checklist

### Day 1: Foundation
- [ ] Update documentation files
- [ ] Create folder structure
- [ ] Set up mock data
- [ ] Create base layouts

### Day 2-3: Application Flow
- [ ] Build wizard component
- [ ] Create all form steps
- [ ] Implement validation
- [ ] Add file upload mock
- [ ] Create submission flow

### Day 4: Admin Dashboard
- [ ] Build applications list
- [ ] Create detail view
- [ ] Add filtering/search
- [ ] Implement status updates
- [ ] Create metrics dashboard

### Day 5: Post-Approval
- [ ] Build status checker
- [ ] Create e-signature mock
- [ ] Build welcome kit page
- [ ] Add portal access flow
- [ ] Final testing & polish

## 🛠️ Technical Notes

### State Management
```typescript
// Use React Context for application state
const ApplicationContext = createContext<ApplicationContextType>()

// Persist draft applications
const useDraftPersistence = () => {
  // Auto-save to localStorage
  // Clear on successful submission
  // Restore on page reload
}
```

### Validation Rules
```typescript
const validationRules = {
  ein: /^\d{2}-\d{7}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{3}-\d{3}-\d{4}$/,
  resaleCert: { 
    required: true, 
    fileTypes: ['.pdf', '.jpg', '.png'],
    maxSize: 10 * 1024 * 1024 // 10MB
  }
}
```

### Mock API Responses
```typescript
// Simulate backend responses
const mockAPI = {
  submitApplication: async (data: ApplicationData) => {
    await delay(1500)
    return {
      success: true,
      applicationId: `APP-${Date.now()}`,
      estimatedReviewTime: '1-2 business days'
    }
  }
}
```

## 🎯 Deliverables

By the end of this implementation:
1. ✅ Complete visual prototype of onboarding flow
2. ✅ Fully integrated with existing portal design
3. ✅ Mobile-responsive implementation
4. ✅ Mock data demonstrating various application states
5. ✅ Admin tools for application management
6. ✅ Clear documentation of the feature flow

## 🚀 Next Steps

After mockup completion:
1. Gather stakeholder feedback
2. Refine UX based on testing
3. Document API requirements
4. Plan backend integration
5. Consider third-party integrations (DocuSign, credit checks)

---

This implementation will create a compelling demonstration of how modern B2B onboarding can streamline operations while maintaining compliance and security standards.