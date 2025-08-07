"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Table,
  Presentation,
  BookOpen,
  AlertCircle,
  Clock,
  Filter,
  DollarSign
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: string
  fileSize: string
  lastUpdated: string
  isNew: boolean
  downloadUrl: string
  thumbnail?: string
}

/**
 * @description Sales resources page for sales representatives
 * @fileoverview Access to sales materials, price sheets, and training documents
 */
export default function SalesResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Simulate loading resources
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockResources: Resource[] = [
          // Order Forms
          {
            id: "res-1",
            title: "2024 Wholesale Order Form",
            description: "Standard order form for all wholesale accounts with updated pricing",
            category: "Order Forms",
            type: "pdf",
            fileSize: "2.3 MB",
            lastUpdated: "2024-01-15",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-2",
            title: "Quick Order Template (Excel)",
            description: "Excel template for bulk ordering with automatic calculations",
            category: "Order Forms",
            type: "excel",
            fileSize: "1.1 MB",
            lastUpdated: "2024-01-10",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-3",
            title: "Special Order Request Form",
            description: "Form for custom orders and special make-up requests",
            category: "Order Forms",
            type: "pdf",
            fileSize: "890 KB",
            lastUpdated: "2023-12-20",
            isNew: false,
            downloadUrl: "#"
          },
          
          // Price Sheets
          {
            id: "res-4",
            title: "Tier 1 Price List (30% Discount)",
            description: "Complete pricing for basic dealer accounts",
            category: "Price Sheets",
            type: "pdf",
            fileSize: "3.5 MB",
            lastUpdated: "2024-01-28",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-5",
            title: "Tier 2 Price List (40% Discount)",
            description: "Complete pricing for standard dealer accounts",
            category: "Price Sheets",
            type: "pdf",
            fileSize: "3.5 MB",
            lastUpdated: "2024-01-28",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-6",
            title: "Tier 3 Price List (50% Discount)",
            description: "Complete pricing for premium dealer accounts",
            category: "Price Sheets",
            type: "pdf",
            fileSize: "3.5 MB",
            lastUpdated: "2024-01-28",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-7",
            title: "SMU Exclusive Products Catalog",
            description: "Special make-up items available to qualified accounts only",
            category: "Price Sheets",
            type: "pdf",
            fileSize: "4.2 MB",
            lastUpdated: "2024-01-20",
            isNew: false,
            downloadUrl: "#"
          },
          
          // Marketing Materials
          {
            id: "res-8",
            title: "Spring 2024 Product Catalog",
            description: "Full color catalog featuring new spring collection",
            category: "Marketing Materials",
            type: "pdf",
            fileSize: "25.8 MB",
            lastUpdated: "2024-01-25",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-9",
            title: "Product Photography Pack",
            description: "High-resolution product images for marketing use",
            category: "Marketing Materials",
            type: "zip",
            fileSize: "156.2 MB",
            lastUpdated: "2024-01-18",
            isNew: false,
            downloadUrl: "#"
          },
          {
            id: "res-10",
            title: "Social Media Templates",
            description: "Ready-to-use templates for Instagram, Facebook, and TikTok",
            category: "Marketing Materials",
            type: "zip",
            fileSize: "45.3 MB",
            lastUpdated: "2024-01-22",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-11",
            title: "Email Campaign Templates",
            description: "Professional email templates for customer outreach",
            category: "Marketing Materials",
            type: "zip",
            fileSize: "12.7 MB",
            lastUpdated: "2024-01-12",
            isNew: false,
            downloadUrl: "#"
          },
          
          // Training Documents
          {
            id: "res-12",
            title: "Sales Rep Handbook 2024",
            description: "Complete guide to policies, procedures, and best practices",
            category: "Training Documents",
            type: "pdf",
            fileSize: "8.9 MB",
            lastUpdated: "2024-01-05",
            isNew: false,
            downloadUrl: "#"
          },
          {
            id: "res-13",
            title: "Product Training: Spring Collection",
            description: "Detailed product knowledge for new spring items",
            category: "Training Documents",
            type: "pdf",
            fileSize: "15.3 MB",
            lastUpdated: "2024-01-28",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-14",
            title: "B2B Portal Training Video",
            description: "Step-by-step guide to using the B2B portal effectively",
            category: "Training Documents",
            type: "video",
            fileSize: "234.5 MB",
            lastUpdated: "2024-01-10",
            isNew: false,
            downloadUrl: "#"
          },
          
          // Presentation Decks
          {
            id: "res-15",
            title: "2024 Company Overview Deck",
            description: "Updated presentation for new customer meetings",
            category: "Presentation Decks",
            type: "pptx",
            fileSize: "18.7 MB",
            lastUpdated: "2024-01-20",
            isNew: true,
            downloadUrl: "#"
          },
          {
            id: "res-16",
            title: "Spring Collection Presentation",
            description: "Visual presentation of new spring products",
            category: "Presentation Decks",
            type: "pptx",
            fileSize: "45.2 MB",
            lastUpdated: "2024-01-25",
            isNew: true,
            downloadUrl: "#"
          }
        ]
        
        setResources(mockResources)
        setFilteredResources(mockResources)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading resources:", error)
        setIsLoading(false)
      }
    }

    loadResources()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...resources]

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(resource => resource.category === selectedCategory)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredResources(filtered)
  }, [searchTerm, selectedCategory, resources])

  const categories = [
    { value: "all", label: "All Resources" },
    { value: "Order Forms", label: "Order Forms" },
    { value: "Price Sheets", label: "Price Sheets" },
    { value: "Marketing Materials", label: "Marketing Materials" },
    { value: "Training Documents", label: "Training Documents" },
    { value: "Presentation Decks", label: "Presentation Decks" }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'excel':
        return <Table className="h-8 w-8 text-green-500" />
      case 'pptx':
        return <Presentation className="h-8 w-8 text-orange-500" />
      case 'video':
        return <BookOpen className="h-8 w-8 text-purple-500" />
      case 'zip':
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading resources...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Resources</h1>
          <p className="text-gray-600 mt-2">Access all sales tools and materials</p>
        </div>

        {/* Announcement Banner */}
        <Card className="bg-primary-light border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">New Spring 2024 Materials Available!</p>
                <p className="text-sm text-gray-600 mt-1">
                  Updated price lists, product catalogs, and training materials have been added. 
                  Check the &quot;New&quot; badges to see what&apos;s been recently updated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-3">
            <FileText className="mr-2 h-4 w-4" />
            Order Forms
          </Button>
          <Button variant="outline" className="h-auto py-3">
            <DollarSign className="mr-2 h-4 w-4" />
            Price Lists
          </Button>
          <Button variant="outline" className="h-auto py-3">
            <ImageIcon className="mr-2 h-4 w-4" />
            Marketing
          </Button>
          <Button variant="outline" className="h-auto py-3">
            <BookOpen className="mr-2 h-4 w-4" />
            Training
          </Button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredResources.length} resources
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  {getFileIcon(resource.type)}
                  {resource.isNew && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {new Date(resource.lastUpdated).toLocaleDateString()}
                  </span>
                  <span>{resource.fileSize}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recently Updated Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Updated</CardTitle>
            <CardDescription>Resources updated in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources
                .filter(r => {
                  const updatedDate = new Date(r.lastUpdated)
                  const sevenDaysAgo = new Date()
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                  return updatedDate > sevenDaysAgo
                })
                .slice(0, 5)
                .map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(resource.type)}
                      <div>
                        <p className="font-medium text-sm">{resource.title}</p>
                        <p className="text-xs text-gray-500">{resource.category}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}