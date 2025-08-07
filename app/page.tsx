import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, TrendingUp, Shield, Zap, Users, Package } from "lucide-react"

/**
 * @description Marketing landing page for B2B portal
 * @fileoverview Homepage explaining portal benefits with CTA to login
 */
export default function HomePage() {
  const features = [
    {
      icon: TrendingUp,
      title: "Account-Specific Pricing",
      description: "See your negotiated prices instantly. No more calling for quotes."
    },
    {
      icon: Package,
      title: "Real-Time Inventory",
      description: "Check stock levels before you order. Avoid backorder surprises."
    },
    {
      icon: Shield,
      title: "Secure Ordering",
      description: "PCI-compliant checkout with your preferred payment terms."
    },
    {
      icon: Zap,
      title: "Quick Reorder",
      description: "Reorder your favorites in seconds. Save time on routine orders."
    },
    {
      icon: Users,
      title: "Multi-User Access",
      description: "Give your team their own logins. Control who can order."
    },
    {
      icon: ShoppingBag,
      title: "Order History",
      description: "Track shipments, download invoices, and analyze spending."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">B2B Portal</span>
          </div>
          <Button asChild>
            <Link href="/login">Login to Demo</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Your B2B Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your wholesale ordering with account-specific pricing, real-time inventory, 
            and powerful order management tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Try Demo Portal</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Order Efficiently
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our B2B portal is designed specifically for wholesale buyers, 
            with features that save time and reduce errors.
          </p>
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
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-primary text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience the Demo?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              See how our B2B portal can transform your ordering process. 
              Try the demo with sample data and explore all features.
            </p>
            <div className="space-y-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Login to Demo Portal</Link>
              </Button>
              <div className="text-sm opacity-75">
                Use demo@retailer.com or demo@salesrep.com with password: demo
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 B2B Portal Demo. All rights reserved.</p>
            <p className="text-sm">
              This is a demonstration portal with sample data. No real orders will be processed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
