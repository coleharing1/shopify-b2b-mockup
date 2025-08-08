'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Search, Filter, Upload, Download } from "lucide-react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Product Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage product catalog and inventory
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="at-once">At Once</SelectItem>
                  <SelectItem value="prebook">Prebook</SelectItem>
                  <SelectItem value="closeout">Closeout</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium">Product</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">SKU</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Category</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Price</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Stock</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                    <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 rounded" />
                        <div>
                          <p className="font-medium">Trail Runner Pro</p>
                          <p className="text-sm text-muted-foreground">Running Shoes</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">TRP-001</td>
                    <td className="px-4 py-3 text-sm">Footwear</td>
                    <td className="px-4 py-3 text-sm">$189.99</td>
                    <td className="px-4 py-3 text-sm">245</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">Active</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline">Edit</Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 rounded" />
                        <div>
                          <p className="font-medium">Summit Jacket</p>
                          <p className="text-sm text-muted-foreground">Outerwear</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">SJ-002</td>
                    <td className="px-4 py-3 text-sm">Apparel</td>
                    <td className="px-4 py-3 text-sm">$299.99</td>
                    <td className="px-4 py-3 text-sm">123</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">Active</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline">Edit</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Full product management interface coming in Phase 5, including bulk editing, 
                variant management, and advanced inventory controls.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}