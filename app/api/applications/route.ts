import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

/**
 * @description Mock API endpoint for dealer applications
 * @fileoverview Simulates application submission and retrieval for demo purposes
 */

const dataFilePath = path.join(process.cwd(), 'public/mockdata/applications.json')

async function readApplications() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(data).applications
  } catch (error) {
    console.error('Error reading applications file:', error)
    return []
  }
}

async function writeApplications(data: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify({ applications: data }, null, 2))
  } catch (error) {
    console.error('Error writing applications file:', error)
  }
}

export async function GET(request: NextRequest) {
  const applications = await readApplications()
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const id = searchParams.get('id')
  
  // Filter by ID if provided
  if (id) {
    const application = applications.find((app: any) => app.id === id)
    if (application) {
      return NextResponse.json(application)
    }
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }
  
  // Filter by status if provided
  let filteredApps = applications
  if (status && status !== 'all') {
    filteredApps = applications.filter((app: any) => app.status === status)
  }
  
  return NextResponse.json({ applications: filteredApps })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const applications = await readApplications()
    
    // Generate new application ID
    const appNumber = applications.length + 1
    const newApplication = {
      id: `APP-2025-${String(appNumber).padStart(3, '0')}`,
      ...body,
      status: 'pending',
      submittedAt: new Date().toISOString()
    }
    
    // Add to in-memory storage
    applications.unshift(newApplication)
    await writeApplications(applications)
    
    return NextResponse.json({ 
      success: true, 
      applicationId: newApplication.id,
      message: 'Application submitted successfully'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit application' 
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes, reviewedBy, rejectionReason } = body
    const applications = await readApplications()
    
    const appIndex = applications.findIndex((app: any) => app.id === id)
    if (appIndex === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    
    // Update application status
    applications[appIndex] = {
      ...applications[appIndex],
      status,
      reviewedAt: new Date().toISOString(),
      ...(notes && { notes }),
      ...(reviewedBy && { reviewedBy }),
      ...(rejectionReason && { rejectionReason })
    }
    
    await writeApplications(applications)
    
    return NextResponse.json({ 
      success: true, 
      application: applications[appIndex]
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update application' 
    }, { status: 500 })
  }
}
