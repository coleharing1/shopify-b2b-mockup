"use client"

import { useEffect, useMemo, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Phone, Building2, Shield, Filter, RefreshCw } from "lucide-react"

/**
 * @fileoverview Admin Users page for viewing retailer contacts and roles
 * @description Displays a searchable, filterable list of retailer contacts derived from companies
 */

interface CompanyRecord {
  id: string
  name: string
  type: string
  accountNumber: string
  status: string
  assignedRepId: string
  primaryContact?: { name: string; email: string; phone: string }
}

interface AdminUserRow {
  id: string
  companyId: string
  name: string
  email: string
  phone: string
  company: string
  accountNumber: string
  status: string
  role: "retailer" | "admin"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [type, setType] = useState<string>("all")

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/mockdata/companies.json")
        const data = await res.json()
        const rows: AdminUserRow[] = (data?.companies as CompanyRecord[]).map((c) => ({
          id: `${c.id}-primary`,
          companyId: c.id,
          name: c.primaryContact?.name || c.name,
          email: c.primaryContact?.email || `${c.accountNumber.toLowerCase()}@example.com`,
          phone: c.primaryContact?.phone || "",
          company: c.name,
          accountNumber: c.accountNumber,
          status: c.status,
          role: "retailer",
        }))
        setUsers(rows)
      } catch (e) {
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (status !== "all" && u.status !== status) return false
      if (type !== "all" && !u.accountNumber.startsWith(type.toUpperCase())) return false
      if (search) {
        const q = search.toLowerCase()
        const t = `${u.name} ${u.email} ${u.company} ${u.accountNumber}`.toLowerCase()
        if (!t.includes(q)) return false
      }
      return true
    })
  }, [users, status, type, search])

  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" /> Admin Users
            </h1>
            <p className="text-sm text-muted-foreground">Retailer contacts and roles</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</CardTitle>
            <CardDescription>Search and narrow users</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Search name, email, company, account #" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ORC">Premium</SelectItem>
                <SelectItem value="USB">Preferred</SelectItem>
                <SelectItem value="WCS">Standard</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setSearch(""); setStatus("all"); setType("all") }}>Clear</Button>
              <Button className="flex-1">Export</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading users…</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">User</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Company</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Account</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Status</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{u.name}</span>
                              <Badge variant="outline" className="text-xs capitalize">{u.role}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {u.email}</span>
                              {u.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {u.phone}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{u.company}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{u.accountNumber}</td>
                        <td className="px-4 py-3">
                          <Badge variant={u.status === "active" ? "secondary" : "outline"} className="capitalize">
                            {u.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">View Company</Button>
                            <Button variant="outline" size="sm"><Shield className="h-3 w-3 mr-1" /> Impersonate</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}


