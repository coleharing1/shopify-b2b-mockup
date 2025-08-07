import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Package,
  CalendarDays,
  Tag,
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Search,
  CreditCard,
  FileText,
  Bell,
  MapPin,
  Settings,
  UserPlus,
  Eye,
  Download,
  Filter,
} from "lucide-react"

/**
 * @fileoverview Marketing landing page for the B2B portal demo
 * @description Elevated homepage with hero, order-type spotlight, how-it-works, features, and CTA
 */
export default function HomePage() {
  const features = [
    {
      icon: TrendingUp,
      title: "Account-Specific Pricing",
      description: "See your negotiated prices instantly. No more calling for quotes.",
    },
    {
      icon: Package,
      title: "Real-Time Inventory",
      description: "Check stock levels before you order. Avoid backorder surprises.",
    },
    {
      icon: Shield,
      title: "Secure B2B Checkout",
      description: "POs, terms, and approvals supported in a familiar flow.",
    },
    {
      icon: Zap,
      title: "Quick Reorder",
      description: "Reorder your favorites in seconds. Save time on routine orders.",
    },
    {
      icon: Users,
      title: "Multi-User Access",
      description: "Team logins with roles and permissions for control.",
    },
    {
      icon: ShoppingBag,
      title: "Order History",
      description: "Track shipments, download invoices, analyze spend.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-8rem] -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-primary/30 to-blue-300 opacity-30"
            aria-hidden
          />
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">B2B Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/quick">Explore Routes</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login to Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-gray-700 bg-white/70">
            <Sparkles className="h-4 w-4 text-primary" />
            New: Support for At‑Once, Prebook, and Closeout orders
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Wholesale ordering that’s fast, accurate, and built for B2B
          </h1>
          <p className="mt-5 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Tiered pricing, live inventory, seasonal prebooks, and time‑boxed closeouts — all in one modern, mobile‑first portal.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">
                Start the Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/quick">Quick Navigation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#order-types">See Order Types</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Order Types Spotlight */}
      <section id="order-types" className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <Badge className="w-fit bg-green-600 text-white">At‑Once</Badge>
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" /> Ready to Ship
              </CardTitle>
              <CardDescription>Live ATS inventory • 1‑5 day ship windows • Quick reorder</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/retailer/at-once">Shop Current Stock</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <Badge className="w-fit bg-blue-600 text-white">Prebook</Badge>
              <CardTitle className="text-xl flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" /> Future Seasons
              </CardTitle>
              <CardDescription>Seasonal linesheets • Delivery windows • 30‑50% deposit</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/retailer/prebook">Explore Prebook</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <Badge className="w-fit bg-red-600 text-white">Closeout</Badge>
              <CardTitle className="text-xl flex items-center gap-2">
                <Tag className="h-5 w-5 text-red-600" /> Timed Clearance
              </CardTitle>
              <CardDescription>Deep discounts • Exact quantities • Final sale</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/quick">View Closeout (Demo)</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Stats */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted by B2B Teams</h2>
            <p className="text-lg text-gray-600">Real results from our demo environment</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-gray-600 font-medium">Orders Processed</div>
              <div className="text-sm text-gray-500">In demo environment</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">15</div>
              <div className="text-gray-600 font-medium">Sales Reps Active</div>
              <div className="text-sm text-gray-500">Across all accounts</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-gray-600 font-medium">Order Accuracy</div>
              <div className="text-sm text-gray-500">No pricing errors</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2.5x</div>
              <div className="text-gray-600 font-medium">Faster Ordering</div>
              <div className="text-sm text-gray-500">vs phone/email</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Sign in to your role</CardTitle>
              <CardDescription>Retailer, Rep, or Admin — login routes you to the right dashboard.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Browse, filter, and add</CardTitle>
              <CardDescription>Search catalogs, view pricing, and add items with one click.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3. Submit with confidence</CardTitle>
              <CardDescription>Type‑specific validation ensures no mixing and correct terms.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Role-Based Quick Access */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Demo Experience</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Jump straight into the role that matches your needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">I'm a Retailer</h3>
              <p className="text-gray-600 mb-6">Browse products, see my pricing, place orders</p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Account-specific pricing</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time inventory</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Order history & tracking</span>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href="/login?role=retailer">Try Retailer Demo</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-green-200">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">I'm a Sales Rep</h3>
              <p className="text-gray-600 mb-6">Manage accounts, place orders for customers</p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Customer 360 view</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Order on behalf</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sales analytics</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login?role=rep">Try Rep Demo</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">I'm an Admin</h3>
              <p className="text-gray-600 mb-6">Manage applications, approve accounts</p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Application management</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>User permissions</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>System analytics</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/login?role=admin">Try Admin Demo</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="bg-gradient-to-r from-red-50 to-green-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Transform Your B2B Operations</h2>
            <p className="text-lg text-gray-600">See the difference our portal makes</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-6">❌ Before: Manual Chaos</h3>
              <div className="space-y-4 text-left bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Manual price lookups</div>
                    <div className="text-sm text-gray-600">Phone calls and emails for every quote</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Stock level guesswork</div>
                    <div className="text-sm text-gray-600">No real-time inventory visibility</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Email order confusion</div>
                    <div className="text-sm text-gray-600">Back-and-forth clarifications</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Frequent pricing errors</div>
                    <div className="text-sm text-gray-600">Wrong tiers, outdated catalogs</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">✅ After: Streamlined Portal</h3>
              <div className="space-y-4 text-left bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Instant pricing display</div>
                    <div className="text-sm text-gray-600">Your tier pricing, automatically applied</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Real-time inventory</div>
                    <div className="text-sm text-gray-600">Live stock levels for confident ordering</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">One-click ordering</div>
                    <div className="text-sm text-gray-600">Add to cart, review, submit in minutes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">100% accurate pricing</div>
                    <div className="text-sm text-gray-600">No more pricing disputes or errors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview by Role */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Features Tailored to Your Role</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore what each user type can accomplish in our B2B portal</p>
        </div>

        <div className="space-y-16 max-w-7xl mx-auto">
          {/* Retailer Features */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Retailer Portal</h3>
                    <p className="text-gray-600">Everything buyers need to order efficiently</p>
                  </div>
                </div>
                <Button className="w-full mb-4" asChild>
                  <Link href="/login?role=retailer">Try Retailer Demo</Link>
                </Button>
                <div className="text-sm text-gray-500">
                  Login: john@outdoorco.com
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Account-Specific Pricing</h4>
                    <p className="text-sm text-gray-600">See your negotiated tier pricing instantly. No more guessing or calling for quotes.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Advanced Search & Filters</h4>
                    <p className="text-sm text-gray-600">Find products by category, size, color, price range, and availability status.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Real-Time Inventory</h4>
                    <p className="text-sm text-gray-600">Check stock levels before ordering. Avoid backorder surprises with live updates.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Multi-Order Types</h4>
                    <p className="text-sm text-gray-600">At-Once, Prebook, and Closeout orders with type-specific workflows and validation.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Flexible Checkout</h4>
                    <p className="text-sm text-gray-600">Pay with PO numbers, terms, or cards. Support for deposit requirements on prebooks.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Order History & Tracking</h4>
                    <p className="text-sm text-gray-600">View past orders, track shipments, download invoices, and analyze spending patterns.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Sales Rep Features */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Sales Rep Tools</h3>
                    <p className="text-gray-600">Manage accounts and drive sales effectively</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mb-4" asChild>
                  <Link href="/login?role=rep">Try Rep Demo</Link>
                </Button>
                <div className="text-sm text-gray-500">
                  Login: alex@b2b.com
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Customer 360 View</h4>
                    <p className="text-sm text-gray-600">Complete customer profiles with purchase history, preferences, and account status.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <ShoppingBag className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Order on Behalf</h4>
                    <p className="text-sm text-gray-600">Place orders for customers with proper pricing and approval workflows.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Sales Analytics</h4>
                    <p className="text-sm text-gray-600">Track performance, customer trends, and territory insights with detailed reporting.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reorder Reminders</h4>
                    <p className="text-sm text-gray-600">Automated alerts when customers are running low on frequently ordered items.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Territory Management</h4>
                    <p className="text-sm text-gray-600">Manage assigned accounts, track territory performance, and identify growth opportunities.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Export & Reporting</h4>
                    <p className="text-sm text-gray-600">Generate customer reports, order summaries, and sales data for external systems.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Admin Features */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Admin Controls</h3>
                    <p className="text-gray-600">Comprehensive system management and oversight</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full mb-4" asChild>
                  <Link href="/login?role=admin">Try Admin Demo</Link>
                </Button>
                <div className="text-sm text-gray-500">
                  Login: admin@b2b.com
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <UserPlus className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Application Management</h4>
                    <p className="text-sm text-gray-600">Review and approve new retailer applications with document verification.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">User & Permissions</h4>
                    <p className="text-sm text-gray-600">Manage user accounts, roles, and access permissions across the portal.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">System Analytics</h4>
                    <p className="text-sm text-gray-600">Monitor portal usage, order volumes, and performance metrics across all users.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Filter className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Catalog Management</h4>
                    <p className="text-sm text-gray-600">Configure pricing tiers, product visibility, and access controls by account type.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Compliance & Reporting</h4>
                    <p className="text-sm text-gray-600">Generate compliance reports, audit logs, and regulatory documentation.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">System Configuration</h4>
                    <p className="text-sm text-gray-600">Configure portal settings, integrations, and business rules for optimal operation.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Everything you need to order efficiently</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Built for wholesale buyers and reps — fast, accurate, and mobile‑first.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted by Leading B2B Companies</h2>
            <p className="text-lg text-gray-600">See what our demo users are saying</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "The portal cut our ordering time from 2 hours to 15 minutes. The real-time pricing and inventory visibility is a game-changer for our buying decisions."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">Purchasing Manager, Elite Sporting Goods</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Managing 15+ accounts used to be overwhelming. Now I can place orders for customers, track everything, and provide better service than ever."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mike Chen</div>
                    <div className="text-sm text-gray-600">Sales Rep, Mountain Territory</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "The application approval workflow and user management features streamlined our onboarding process. New retailers get set up in days, not weeks."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Lisa Rodriguez</div>
                    <div className="text-sm text-gray-600">Operations Director, B2B Corp</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Primary CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-primary text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to experience the demo?</h2>
            <p className="text-lg mb-8/ text-white/90">
              See how the portal transforms your wholesale operations. Explore with sample data.
            </p>
            <div className="space-y-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Login to Demo Portal</Link>
              </Button>
              <div className="text-sm opacity-90">Use john@outdoorco.com, alex@b2b.com, or admin@b2b.com — any password</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2025 B2B Portal Demo. All rights reserved.</p>
            <p className="text-sm">This is a demonstration portal with sample data. No real orders will be processed.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
