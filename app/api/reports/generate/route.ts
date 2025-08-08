import { NextRequest, NextResponse } from 'next/server'
import { ReportingService, ReportType, ReportFormat } from '@/lib/services/reporting-service'
import { verifySession } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, format, filters, email } = body

    // Validate report type and format
    const validTypes: ReportType[] = [
      'sales-summary',
      'inventory-status',
      'customer-activity',
      'financial-overview',
      'product-performance',
      'order-history',
      'commission-statement',
      'tax-summary'
    ]

    const validFormats: ReportFormat[] = ['csv', 'pdf', 'excel', 'json']

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid report type: ${type}` },
        { status: 400 }
      )
    }

    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format: ${format}` },
        { status: 400 }
      )
    }

    // Apply role-based restrictions
    const roleRestrictions: Record<string, ReportType[]> = {
      retailer: ['order-history', 'product-performance'],
      rep: ['sales-summary', 'customer-activity', 'commission-statement', 'product-performance'],
      admin: validTypes // Admin can generate all reports
    }

    if (!roleRestrictions[session.role]?.includes(type)) {
      return NextResponse.json(
        { error: 'You do not have permission to generate this report' },
        { status: 403 }
      )
    }

    // Apply automatic filters based on role
    const appliedFilters = { ...filters }
    if (session.role === 'retailer') {
      appliedFilters.companyId = session.companyId
    } else if (session.role === 'sales_rep') {
      appliedFilters.salesRepId = session.id
    }

    // Generate the report
    const { data, filename } = await ReportingService.generateReport(
      type,
      appliedFilters,
      format
    )

    // If email delivery is requested
    if (email) {
      const emailSent = await ReportingService.emailReport(
        data,
        [email],
        `Your ${type} report is ready`
      )

      if (emailSent) {
        return NextResponse.json({
          success: true,
          message: `Report sent to ${email}`,
          filename
        })
      }
    }

    // Export the data to the requested format
    const blob = await ReportingService.exportData(data, format)
    const buffer = await blob.arrayBuffer()

    // Set appropriate headers for file download
    const headers = new Headers()
    headers.set('Content-Type', blob.type)
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)
    headers.set('Content-Length', buffer.byteLength.toString())

    return new NextResponse(buffer, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get report history for the user
    const history = await ReportingService.getReportHistory(session.id)

    // Filter history based on role
    const filteredHistory = session.role === 'admin' 
      ? history 
      : history.filter(report => report.generatedBy === session.id)

    return NextResponse.json({
      success: true,
      data: filteredHistory
    })
  } catch (error) {
    console.error('Report history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report history' },
      { status: 500 }
    )
  }
}