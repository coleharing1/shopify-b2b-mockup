"use client"

/**
 * @fileoverview Shipping Management inspired by professional shipping platform UIs
 * @description Clean data table with actions, mapping configuration, and carrier management
 */

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle,
  Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShippingMethod {
  id: string
  name: string
  carrier: string
  method: string
  supplier: string
  status: 'active' | 'inactive'
  cost: number
  estimatedDays: string
}

interface ShippingRule {
  id: string
  name: string
  condition: string
  method: string
  priority: number
  status: 'active' | 'inactive'
}

export default function ShippingManagementPage() {
  const { toast } = useToast()
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([
    {
      id: '1',
      name: 'Ground',
      carrier: 'FedEx',
      method: 'Residential',
      supplier: "Kinsey's North",
      status: 'active',
      cost: 12.50,
      estimatedDays: '3-5'
    },
    {
      id: '2',
      name: 'UPS1',
      carrier: 'FedEx',
      method: 'FEDEX STANDARD ONITE',
      supplier: "Kinsey's North",
      status: 'active',
      cost: 25.00,
      estimatedDays: '1-2'
    },
    {
      id: '3',
      name: 'UPS2',
      carrier: 'FedEx',
      method: 'FedEx 2nd Day',
      supplier: "Kinsey's North",
      status: 'active',
      cost: 18.75,
      estimatedDays: '2'
    }
  ])

  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([
    {
      id: '1',
      name: 'Standard Ground',
      condition: 'Order < $100',
      method: 'Ground Shipping',
      priority: 1,
      status: 'active'
    },
    {
      id: '2',
      name: 'Free Shipping',
      condition: 'Order >= $100',
      method: 'Free Ground',
      priority: 2,
      status: 'active'
    },
    {
      id: '3',
      name: 'Express Override',
      condition: 'Rush Order',
      method: 'Next Day',
      priority: 3,
      status: 'active'
    }
  ])

  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null)

  const [newMethod, setNewMethod] = useState({
    name: '',
    carrier: '',
    method: '',
    supplier: '',
    cost: 0,
    estimatedDays: ''
  })

  const carriers = ['FedEx', 'UPS', 'USPS', 'DHL']
  const suppliers = ["Kinsey's North", "Supplier B", "Supplier C"]

  const handleAddMethod = () => {
    if (!newMethod.name || !newMethod.carrier || !newMethod.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const method: ShippingMethod = {
      id: Date.now().toString(),
      ...newMethod,
      status: 'active'
    }

    setShippingMethods(prev => [...prev, method])
    setNewMethod({
      name: '',
      carrier: '',
      method: '',
      supplier: '',
      cost: 0,
      estimatedDays: ''
    })
    setIsAddingMethod(false)

    toast({
      title: "Success",
      description: "Shipping method added successfully"
    })
  }

  const handleDeleteMethod = (id: string) => {
    setShippingMethods(prev => prev.filter(m => m.id !== id))
    toast({
      title: "Success",
      description: "Shipping method deleted"
    })
  }

  const toggleMethodStatus = (id: string) => {
    setShippingMethods(prev => prev.map(method => 
      method.id === id 
        ? { ...method, status: method.status === 'active' ? 'inactive' : 'active' }
        : method
    ))
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping Management</h1>
            <p className="text-gray-600 mt-1">Configure shipping methods and rules</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="methods" className="space-y-6">
          <TabsList>
            <TabsTrigger value="methods">Shipping Methods</TabsTrigger>
            <TabsTrigger value="rules">Shipping Rules</TabsTrigger>
            <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
          </TabsList>

          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Active Shipping Methods
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage carrier mappings and shipping methods
                    </p>
                  </div>
                  <Dialog open={isAddingMethod} onOpenChange={setIsAddingMethod}>
                    <DialogTrigger>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add Shipping Method</DialogTitle>
                        <DialogDescription>
                          Configure a new shipping method mapping
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="method-name">Method Name</Label>
                            <Input
                              id="method-name"
                              value={newMethod.name}
                              onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Ground, Express"
                            />
                          </div>
                          <div>
                            <Label htmlFor="carrier">Carrier</Label>
                            <Select
                              value={newMethod.carrier}
                              onValueChange={(value) => setNewMethod(prev => ({ ...prev, carrier: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select carrier" />
                              </SelectTrigger>
                              <SelectContent>
                                {carriers.map(carrier => (
                                  <SelectItem key={carrier} value={carrier}>
                                    {carrier}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="shipping-method">Shipping Method</Label>
                          <Input
                            id="shipping-method"
                            value={newMethod.method}
                            onChange={(e) => setNewMethod(prev => ({ ...prev, method: e.target.value }))}
                            placeholder="e.g., FEDEX STANDARD ONITE"
                          />
                        </div>
                        <div>
                          <Label htmlFor="supplier">Supplier</Label>
                          <Select
                            value={newMethod.supplier}
                            onValueChange={(value) => setNewMethod(prev => ({ ...prev, supplier: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map(supplier => (
                                <SelectItem key={supplier} value={supplier}>
                                  {supplier}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cost">Cost ($)</Label>
                            <Input
                              id="cost"
                              type="number"
                              step="0.01"
                              value={newMethod.cost}
                              onChange={(e) => setNewMethod(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="estimated-days">Estimated Days</Label>
                            <Input
                              id="estimated-days"
                              value={newMethod.estimatedDays}
                              onChange={(e) => setNewMethod(prev => ({ ...prev, estimatedDays: e.target.value }))}
                              placeholder="e.g., 1-2, 3-5"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingMethod(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddMethod}>
                          Add Method
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method Name</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Shipping Method</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Estimated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shippingMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell className="font-medium">{method.name}</TableCell>
                        <TableCell>{method.carrier}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{method.method}</TableCell>
                        <TableCell>{method.supplier}</TableCell>
                        <TableCell>${method.cost.toFixed(2)}</TableCell>
                        <TableCell>{method.estimatedDays} days</TableCell>
                        <TableCell>
                          <Badge 
                            variant={method.status === 'active' ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => toggleMethodStatus(method.id)}
                          >
                            {method.status === 'active' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {method.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteMethod(method.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Shipping Rules
                  </CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shippingRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.condition}</TableCell>
                        <TableCell>{rule.method}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{rule.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                            {rule.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zones">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Configure Shipping Zones</h3>
                  <p className="text-gray-600 mb-4">Set up geographical zones for shipping calculations</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shipping Zone
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
