"use client"

import { useState } from "react"
import { Search, Download, FileText, Image, Video, File, Calendar } from "lucide-react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchBar } from "@/components/ui/search-bar"
import { EmptyState } from "@/components/ui/empty-state"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Resource {
  id: string
  title: string
  description: string
  category: "marketing" | "pricing" | "training" | "forms" | "policies"
  type: "pdf" | "image" | "video" | "document"
  fileSize: string
  updatedAt: string
  isNew: boolean
  downloadUrl: string
  thumbnail?: string
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "2025 Product Catalog",
    description: "Complete product catalog with all current models and specifications",
    category: "marketing",
    type: "pdf",
    fileSize: "12.5 MB",
    updatedAt: "2025-08-01",
    isNew: true,
    downloadUrl: "#",
    thumbnail: "/images/catalog-thumb.jpg"
  },
  {
    id: "2",
    title: "Dealer Price List - Tier 40%",
    description: "Current pricing for 40% discount tier dealers",
    category: "pricing",
    type: "pdf",
    fileSize: "2.3 MB",
    updatedAt: "2025-08-05",
    isNew: true,
    downloadUrl: "#"
  },
  {
    id: "3",
    title: "Quick Order Form",
    description: "Printable order form for phone/fax orders",
    category: "forms",
    type: "pdf",
    fileSize: "856 KB",
    updatedAt: "2025-07-15",
    isNew: false,
    downloadUrl: "#"
  },
  {
    id: "4",
    title: "Product Training Video - New Arrivals",
    description: "Training video covering features of our latest product line",
    category: "training",
    type: "video",
    fileSize: "245 MB",
    updatedAt: "2025-08-03",
    isNew: true,
    downloadUrl: "#"
  },
  {
    id: "5",
    title: "Return Policy & Procedures",
    description: "Complete guide to our return and exchange policies",
    category: "policies",
    type: "document",
    fileSize: "1.2 MB",
    updatedAt: "2025-06-20",
    isNew: false,
    downloadUrl: "#"
  },
  {
    id: "6",
    title: "Social Media Assets Pack",
    description: "Ready-to-use images and videos for social media marketing",
    category: "marketing",
    type: "image",
    fileSize: "45.8 MB",
    updatedAt: "2025-07-28",
    isNew: false,
    downloadUrl: "#"
  },
  {
    id: "7",
    title: "Credit Application Form",
    description: "Application form for establishing dealer credit terms",
    category: "forms",
    type: "pdf",
    fileSize: "1.5 MB",
    updatedAt: "2025-07-10",
    isNew: false,
    downloadUrl: "#"
  },
  {
    id: "8",
    title: "Display Guidelines",
    description: "Best practices for in-store product displays",
    category: "marketing",
    type: "pdf",
    fileSize: "8.7 MB",
    updatedAt: "2025-07-25",
    isNew: false,
    downloadUrl: "#"
  }
]

/**
 * @description Resource center page for retailers
 * @fileoverview Centralized hub for marketing materials and documents
 */
export default function ResourceCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 500)
  }

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getFileIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8" />
      case "image":
        return <Image className="h-8 w-8" />
      case "video":
        return <Video className="h-8 w-8" />
      case "document":
        return <File className="h-8 w-8" />
      default:
        return <File className="h-8 w-8" />
    }
  }

  const getCategoryColor = (category: Resource["category"]) => {
    switch (category) {
      case "marketing":
        return "bg-purple-100 text-purple-800"
      case "pricing":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "forms":
        return "bg-yellow-100 text-yellow-800"
      case "policies":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleDownload = (resource: Resource) => {
    // In production, this would trigger actual download
    console.log(`Downloading: ${resource.title}`)
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Center</h1>
          <p className="mt-2 text-gray-600">
            Download marketing materials, forms, and training resources
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search resources..."
              onSearch={handleSearch}
              isLoading={isSearching}
              className="w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="marketing">Marketing Materials</SelectItem>
              <SelectItem value="pricing">Price Lists</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="forms">Forms</SelectItem>
              <SelectItem value="policies">Policies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="text-sm text-gray-600">
            Found {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""} 
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <EmptyState
            icon={<Search className="h-12 w-12 text-gray-400" />}
            title="No resources found"
            description={searchQuery ? "Try adjusting your search or filters" : "No resources available"}
            action={searchQuery ? {
              label: "Clear search",
              onClick: () => {
                setSearchQuery("")
                setSelectedCategory("all")
              }
            } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card 
                key={resource.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail or Icon */}
                <div className="p-6 bg-gray-50 border-b">
                  <div className="flex items-center justify-center text-gray-400">
                    {getFileIcon(resource.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {resource.title}
                    </h3>
                    {resource.isNew && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 flex-shrink-0">
                        New
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <Badge className={cn("capitalize", getCategoryColor(resource.category))}>
                        {resource.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">File size</span>
                      <span className="text-gray-900">{resource.fileSize}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Updated</span>
                      <span className="text-gray-900">{formatDate(resource.updatedAt)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleDownload(resource)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}