import { Metadata } from "next"
import Link from "next/link"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  ShieldCheck,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "B2B Portal Administration",
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Dealers", href: "/admin/dealers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">Admin Portal</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="inline-block h-4 w-4 mr-1.5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/rep/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sales Portal →
              </Link>
              <Link
                href="/retailer/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Retailer Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <nav className="flex px-4 py-2 gap-1 overflow-x-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              )}
            >
              <item.icon className="inline-block h-4 w-4 mr-1.5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="py-6">
        {children}
      </main>
    </div>
  )
}