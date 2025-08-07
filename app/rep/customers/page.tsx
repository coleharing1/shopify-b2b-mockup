"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { formatCurrency } from "@/lib/mock-data"
import Link from "next/link"

interface Customer {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  accountType: string
  region: string
  state: string
  lastOrderDate: string
  ytdPurchases: number
  status: "active" | "inactive" | "pending"
  creditLimit: number
  creditUsed: number
}

/**
 * @description Customer management page for sales reps
 * @fileoverview Lists all customers assigned to the sales rep
 */
export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  const customersPerPage = 10

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        // Simulate loading customers
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockCustomers: Customer[] = [
          {
            id: "company-1",
            companyName: "Mountain Gear Outfitters",
            contactPerson: "Sarah Johnson",
            email: "sarah@mountaingear.com",
            phone: "(555) 123-4567",
            accountType: "Premium Dealer",
            region: "West",
            state: "CO",
            lastOrderDate: "2024-01-28",
            ytdPurchases: 285420,
            status: "active",
            creditLimit: 50000,
            creditUsed: 12500
          },
          {
            id: "company-2",
            companyName: "Summit Sports Retail",
            contactPerson: "Mike Chen",
            email: "mike@summitsports.com",
            phone: "(555) 234-5678",
            accountType: "Standard Dealer",
            region: "West",
            state: "UT",
            lastOrderDate: "2024-01-25",
            ytdPurchases: 198760,
            status: "active",
            creditLimit: 35000,
            creditUsed: 8900
          },
          {
            id: "company-3",
            companyName: "Alpine Adventure Co",
            contactPerson: "Lisa Martinez",
            email: "lisa@alpineadventure.com",
            phone: "(555) 345-6789",
            accountType: "Premium Dealer",
            region: "West",
            state: "WY",
            lastOrderDate: "2024-01-30",
            ytdPurchases: 176230,
            status: "active",
            creditLimit: 40000,
            creditUsed: 15200
          },
          {
            id: "company-4",
            companyName: "Peak Performance Shop",
            contactPerson: "Tom Wilson",
            email: "tom@peakperformance.com",
            phone: "(555) 456-7890",
            accountType: "Standard Dealer",
            region: "Mountain",
            state: "MT",
            lastOrderDate: "2024-01-22",
            ytdPurchases: 152890,
            status: "active",
            creditLimit: 30000,
            creditUsed: 5600
          },
          {
            id: "company-5",
            companyName: "Trail Blazers Outdoor",
            contactPerson: "Emily Davis",
            email: "emily@trailblazers.com",
            phone: "(555) 567-8901",
            accountType: "Basic Dealer",
            region: "Mountain",
            state: "ID",
            lastOrderDate: "2024-01-29",
            ytdPurchases: 134560,
            status: "active",
            creditLimit: 25000,
            creditUsed: 11200
          },
          {
            id: "company-6",
            companyName: "Wilderness Outpost",
            contactPerson: "Robert Brown",
            email: "robert@wildernessoutpost.com",
            phone: "(555) 678-9012",
            accountType: "Basic Dealer",
            region: "West",
            state: "NV",
            lastOrderDate: "2024-01-15",
            ytdPurchases: 98450,
            status: "active",
            creditLimit: 20000,
            creditUsed: 3400
          },
          {
            id: "company-7",
            companyName: "High Country Sports",
            contactPerson: "Jennifer Lee",
            email: "jennifer@highcountrysports.com",
            phone: "(555) 789-0123",
            accountType: "Premium Dealer",
            region: "Mountain",
            state: "CO",
            lastOrderDate: "2023-12-20",
            ytdPurchases: 89320,
            status: "inactive",
            creditLimit: 45000,
            creditUsed: 0
          },
          {
            id: "company-8",
            companyName: "Base Camp Supply",
            contactPerson: "David Miller",
            email: "david@basecampsupply.com",
            phone: "(555) 890-1234",
            accountType: "Standard Dealer",
            region: "West",
            state: "CA",
            lastOrderDate: "2024-01-31",
            ytdPurchases: 167890,
            status: "active",
            creditLimit: 35000,
            creditUsed: 18900
          }
        ]
        
        setCustomers(mockCustomers)
        setFilteredCustomers(mockCustomers)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading customers:", error)
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...customers]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Account type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(customer => customer.accountType === selectedType)
    }

    // Region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter(customer => customer.region === selectedRegion)
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(customer => customer.status === selectedStatus)
    }

    setFilteredCustomers(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedType, selectedRegion, selectedStatus, customers])

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage)
  const startIndex = (currentPage - 1) * customersPerPage
  const endIndex = startIndex + customersPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Accounts</h1>
            <p className="text-gray-600 mt-2">Manage your assigned customer accounts</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by company, contact, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Premium Dealer">Premium Dealer</option>
                  <option value="Standard Dealer">Standard Dealer</option>
                  <option value="Basic Dealer">Basic Dealer</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  <option value="West">West</option>
                  <option value="Mountain">Mountain</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
        </div>

        {/* Customer Cards - Mobile */}
        <div className="block md:hidden space-y-4">
          {currentCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link 
                      href={`/rep/customers/${customer.id}`}
                      className="font-medium text-lg text-gray-900 hover:text-primary"
                    >
                      {customer.companyName}
                    </Link>
                    <p className="text-sm text-gray-600">{customer.contactPerson}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === 'active' ? 'bg-green-100 text-green-700' :
                    customer.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {customer.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{customer.accountType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{customer.state} - {customer.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{formatCurrency(customer.ytdPurchases)} YTD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/rep/customers/${customer.id}`}>View Details</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href={`/rep/order-for/${customer.id}`}>Place Order</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Table - Desktop */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      YTD Purchases
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <Link 
                            href={`/rep/customers/${customer.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary"
                          >
                            {customer.companyName}
                          </Link>
                          <p className="text-sm text-gray-500">{customer.contactPerson}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.accountType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.state} - {customer.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(customer.ytdPurchases)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          customer.status === 'active' ? 'bg-green-100 text-green-700' :
                          customer.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/rep/customers/${customer.id}`}>View</Link>
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/rep/order-for/${customer.id}`}>Order</Link>
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm text-gray-600 px-4">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}