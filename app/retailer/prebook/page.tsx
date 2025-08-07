"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Calendar, Clock, Package, AlertCircle, TrendingUp, ChevronRight, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { usePrebookCart } from "@/lib/contexts/prebook-cart-context"
import { ORDER_TYPE_COLORS, type Season } from "@/types/order-types"
import { formatCurrency } from "@/lib/mock-data"
import Link from "next/link"

// ... (rest of the component logic)

export default function PrebookPage() {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const { getSeasonGroups, getDepositAmount, getItemCount } = usePrebookCart()
  const seasonGroups = getSeasonGroups()

  // ... (rest of the component logic)

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* ... (rest of JSX) */}
      </div>
    </AuthenticatedLayout>
  )
}
