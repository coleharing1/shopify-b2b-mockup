import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

export default async function CloseoutListDetailPage({
  params
}: {
  params: Promise<{ listId: string }>
}) {
  const { listId } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/retailer/closeouts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Closeouts
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Closeout List: {listId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display details for closeout list {listId}.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Coming in Phase 5: Customer-specific pricing and catalogs.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}