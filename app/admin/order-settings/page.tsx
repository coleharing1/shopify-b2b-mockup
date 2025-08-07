"use client"

import { useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings,
  Package,
  Clock,
  Tag,
  Save,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  Layers,
  Shield,
  Timer
} from "lucide-react"
import { ORDER_TYPE_COLORS } from "@/types/order-types"
import { toast } from "sonner"

interface OrderTypeSettings {
  atOnce: {
    enabled: boolean
    shippingDays: number
    inventoryReserveMinutes: number
    lowStockThreshold: number
    backorderAllowed: boolean
    quickReorderEnabled: boolean
    minOrderValue: number
  }
  prebook: {
    enabled: boolean
    defaultDepositPercent: number
    cancellationDays: number
    modificationDays: number
    requireSizeRuns: boolean
    allowMultiDateDelivery: boolean
    minOrderValue: number
    maxSeasons: number
  }
  closeout: {
    enabled: boolean
    defaultDuration: number
    progressiveDiscounting: boolean
    tierRestrictions: boolean
    finalSaleEnforced: boolean
    minDiscountPercent: number
    maxDiscountPercent: number
    autoRelease: boolean
  }
}

/**
 * @description Admin Order Type Settings Page
 * @fileoverview Configure business rules for all three order types
 */
export default function OrderSettingsPage() {
  const [settings, setSettings] = useState<OrderTypeSettings>({
    atOnce: {
      enabled: true,
      shippingDays: 3,
      inventoryReserveMinutes: 15,
      lowStockThreshold: 10,
      backorderAllowed: true,
      quickReorderEnabled: true,
      minOrderValue: 100
    },
    prebook: {
      enabled: true,
      defaultDepositPercent: 30,
      cancellationDays: 60,
      modificationDays: 30,
      requireSizeRuns: true,
      allowMultiDateDelivery: true,
      minOrderValue: 500,
      maxSeasons: 4
    },
    closeout: {
      enabled: true,
      defaultDuration: 48,
      progressiveDiscounting: true,
      tierRestrictions: true,
      finalSaleEnforced: true,
      minDiscountPercent: 40,
      maxDiscountPercent: 70,
      autoRelease: true
    }
  })

  const [activeTab, setActiveTab] = useState("at-once")
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (orderType: keyof OrderTypeSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [orderType]: {
        ...prev[orderType],
        [setting]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast.success("Order type settings saved successfully")
    setHasChanges(false)
  }

  const handleReset = () => {
    // Reset to defaults
    toast.info("Settings reset to defaults")
    setHasChanges(false)
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Order Type Management
            </h1>
            <p className="text-muted-foreground">
              Configure business rules and settings for each order type
            </p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="at-once" className="flex items-center gap-2">
              <Package className={`h-4 w-4 ${ORDER_TYPE_COLORS['at-once'].text}`} />
              At-Once
            </TabsTrigger>
            <TabsTrigger value="prebook" className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${ORDER_TYPE_COLORS['prebook'].text}`} />
              Prebook
            </TabsTrigger>
            <TabsTrigger value="closeout" className="flex items-center gap-2">
              <Tag className={`h-4 w-4 ${ORDER_TYPE_COLORS['closeout'].text}`} />
              Closeout
            </TabsTrigger>
          </TabsList>

          {/* At-Once Settings */}
          <TabsContent value="at-once" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  At-Once Order Settings
                </CardTitle>
                <CardDescription>
                  Configure settings for immediate fulfillment orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable At-Once Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to place immediate stock orders
                    </p>
                  </div>
                  <Switch
                    checked={settings.atOnce.enabled}
                    onCheckedChange={(checked) => handleSettingChange('atOnce', 'enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Shipping Days</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.atOnce.shippingDays]}
                      onValueChange={([value]) => handleSettingChange('atOnce', 'shippingDays', value)}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">
                      {settings.atOnce.shippingDays} days
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Inventory Reserve Time</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.atOnce.inventoryReserveMinutes]}
                      onValueChange={([value]) => handleSettingChange('atOnce', 'inventoryReserveMinutes', value)}
                      min={5}
                      max={60}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-medium">
                      {settings.atOnce.inventoryReserveMinutes} min
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    How long items remain reserved in cart before release
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Low Stock Threshold</Label>
                  <Input
                    type="number"
                    value={settings.atOnce.lowStockThreshold}
                    onChange={(e) => handleSettingChange('atOnce', 'lowStockThreshold', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Display warning when inventory falls below this level
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Backorders</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept orders for out-of-stock items
                      </p>
                    </div>
                    <Switch
                      checked={settings.atOnce.backorderAllowed}
                      onCheckedChange={(checked) => handleSettingChange('atOnce', 'backorderAllowed', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Quick Reorder</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable one-click reordering for frequent items
                      </p>
                    </div>
                    <Switch
                      checked={settings.atOnce.quickReorderEnabled}
                      onCheckedChange={(checked) => handleSettingChange('atOnce', 'quickReorderEnabled', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Order Value</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={settings.atOnce.minOrderValue}
                      onChange={(e) => handleSettingChange('atOnce', 'minOrderValue', parseFloat(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prebook Settings */}
          <TabsContent value="prebook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Prebook Order Settings
                </CardTitle>
                <CardDescription>
                  Configure settings for seasonal advance orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Prebook Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to place seasonal advance orders
                    </p>
                  </div>
                  <Switch
                    checked={settings.prebook.enabled}
                    onCheckedChange={(checked) => handleSettingChange('prebook', 'enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Deposit Percentage</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.prebook.defaultDepositPercent]}
                      onValueChange={([value]) => handleSettingChange('prebook', 'defaultDepositPercent', value)}
                      min={10}
                      max={50}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">
                      {settings.prebook.defaultDepositPercent}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Industry standard: 30-50% deposit
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cancellation Window (Days)</Label>
                    <Input
                      type="number"
                      value={settings.prebook.cancellationDays}
                      onChange={(e) => handleSettingChange('prebook', 'cancellationDays', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before delivery for free cancellation
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Modification Window (Days)</Label>
                    <Input
                      type="number"
                      value={settings.prebook.modificationDays}
                      onChange={(e) => handleSettingChange('prebook', 'modificationDays', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before delivery to modify orders
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Full Size Runs</Label>
                      <p className="text-sm text-muted-foreground">
                        Enforce complete size run ordering for apparel
                      </p>
                    </div>
                    <Switch
                      checked={settings.prebook.requireSizeRuns}
                      onCheckedChange={(checked) => handleSettingChange('prebook', 'requireSizeRuns', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Multi-Date Delivery</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow single order with multiple delivery dates
                      </p>
                    </div>
                    <Switch
                      checked={settings.prebook.allowMultiDateDelivery}
                      onCheckedChange={(checked) => handleSettingChange('prebook', 'allowMultiDateDelivery', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Order Value</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={settings.prebook.minOrderValue}
                        onChange={(e) => handleSettingChange('prebook', 'minOrderValue', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Active Seasons</Label>
                    <Input
                      type="number"
                      value={settings.prebook.maxSeasons}
                      onChange={(e) => handleSettingChange('prebook', 'maxSeasons', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Season Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Season Management
                </CardTitle>
                <CardDescription>
                  Configure and manage prebook seasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500 text-white">Open</Badge>
                      <div>
                        <p className="font-medium">Spring 2025</p>
                        <p className="text-sm text-muted-foreground">
                          Delivery: Mar 15 - Apr 15 • 30% deposit
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Upcoming</Badge>
                      <div>
                        <p className="font-medium">Fall 2025</p>
                        <p className="text-sm text-muted-foreground">
                          Delivery: Aug 15 - Sep 15 • 40% deposit
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add New Season
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Closeout Settings */}
          <TabsContent value="closeout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-red-600" />
                  Closeout Order Settings
                </CardTitle>
                <CardDescription>
                  Configure settings for clearance and closeout deals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Closeout Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow time-limited clearance sales
                    </p>
                  </div>
                  <Switch
                    checked={settings.closeout.enabled}
                    onCheckedChange={(checked) => handleSettingChange('closeout', 'enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Duration (Hours)</Label>
                  <Select
                    value={settings.closeout.defaultDuration.toString()}
                    onValueChange={(value) => handleSettingChange('closeout', 'defaultDuration', parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 hours (Flash Sale)</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Discount Range</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Min</span>
                      <Input
                        type="number"
                        value={settings.closeout.minDiscountPercent}
                        onChange={(e) => handleSettingChange('closeout', 'minDiscountPercent', parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span>%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Max</span>
                      <Input
                        type="number"
                        value={settings.closeout.maxDiscountPercent}
                        onChange={(e) => handleSettingChange('closeout', 'maxDiscountPercent', parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Progressive Discounting</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase discount over time
                      </p>
                    </div>
                    <Switch
                      checked={settings.closeout.progressiveDiscounting}
                      onCheckedChange={(checked) => handleSettingChange('closeout', 'progressiveDiscounting', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tier Restrictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Limit access based on customer tier
                      </p>
                    </div>
                    <Switch
                      checked={settings.closeout.tierRestrictions}
                      onCheckedChange={(checked) => handleSettingChange('closeout', 'tierRestrictions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Final Sale Enforcement</Label>
                      <p className="text-sm text-muted-foreground">
                        No returns or exchanges on closeout items
                      </p>
                    </div>
                    <Switch
                      checked={settings.closeout.finalSaleEnforced}
                      onCheckedChange={(checked) => handleSettingChange('closeout', 'finalSaleEnforced', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Release Reserved Items</Label>
                      <p className="text-sm text-muted-foreground">
                        Release unpurchased items after cart expiry
                      </p>
                    </div>
                    <Switch
                      checked={settings.closeout.autoRelease}
                      onCheckedChange={(checked) => handleSettingChange('closeout', 'autoRelease', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Closeout List Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Active Closeout Lists
                </CardTitle>
                <CardDescription>
                  Manage active and upcoming closeout events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Timer className="h-4 w-4 text-red-600 animate-pulse" />
                      <div>
                        <p className="font-medium">Winter Clearance</p>
                        <p className="text-sm text-muted-foreground">
                          47 items • 60% off • Expires in 18h
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Scheduled</Badge>
                      <div>
                        <p className="font-medium">Flash Sale</p>
                        <p className="text-sm text-muted-foreground">
                          12 items • 45% off • Starts tomorrow
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    Create New Closeout List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Global Order Settings
            </CardTitle>
            <CardDescription>
              Settings that apply to all order types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                These settings affect all order types and override individual configurations
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Type Mixing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow different order types in same cart
                    </p>
                  </div>
                  <Switch checked={false} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require PO Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Make PO numbers mandatory
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Save Carts</Label>
                    <p className="text-sm text-muted-foreground">
                      Persist cart contents between sessions
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send order confirmations
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}