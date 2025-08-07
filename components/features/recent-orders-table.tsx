import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Order } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/mock-data"

interface RecentOrdersTableProps {
  orders: Order[]
}

/**
 * @description Recent orders display table
 * @fileoverview Shows latest orders with status badges
 */
export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const getStatusColor = (status: string) => {
    const statusColors = {
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/retailer/orders">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium text-gray-600 pb-2">Order #</th>
                  <th className="text-left font-medium text-gray-600 pb-2">Date</th>
                  <th className="text-left font-medium text-gray-600 pb-2">PO Number</th>
                  <th className="text-left font-medium text-gray-600 pb-2">Status</th>
                  <th className="text-right font-medium text-gray-600 pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <Link href={`/retailer/orders/${order.id}`} className="text-primary hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-700">{formatDate(order.orderDate)}</td>
                    <td className="py-3 text-gray-700">{order.poNumber}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}