import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * @description Component playground for testing UI elements
 * @fileoverview Test page to verify all components are working correctly
 */
export default function PlaygroundPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Component Playground</h1>
      
      {/* Buttons Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Cards Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area where you can put any content.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stats Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$125,000</div>
              <p className="text-sm text-gray-600">YTD Purchases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>A simpler card with just content.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Forms Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sample Form</CardTitle>
            <CardDescription>Test form inputs and labels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="demo@retailer.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="Mountain Gear Outfitters" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
        </Card>
      </section>

      {/* Colors Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="w-full h-24 bg-primary rounded-md mb-2"></div>
            <p className="text-sm font-medium">Primary</p>
          </div>
          <div>
            <div className="w-full h-24 bg-success rounded-md mb-2"></div>
            <p className="text-sm font-medium">Success</p>
          </div>
          <div>
            <div className="w-full h-24 bg-warning rounded-md mb-2"></div>
            <p className="text-sm font-medium">Warning</p>
          </div>
          <div>
            <div className="w-full h-24 bg-error rounded-md mb-2"></div>
            <p className="text-sm font-medium">Error</p>
          </div>
        </div>
      </section>
    </div>
  )
}