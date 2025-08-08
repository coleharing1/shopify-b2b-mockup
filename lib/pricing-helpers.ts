/**
 * Client-side pricing helpers
 */

import { PriceList, PriceListAssignment } from '@/types/pricing-types'

/**
 * Load price list for a company (client-side)
 */
export async function loadPriceListForCompany(companyId: string): Promise<PriceList | null> {
  try {
    const response = await fetch('/mockdata/price-lists.json')
    const data = await response.json()
    
    // Find assignment for company
    const assignment = data.assignments.find((a: PriceListAssignment) => 
      a.companyId === companyId
    )
    if (!assignment) return null
    
    // Find price list
    return data.priceLists.find((pl: PriceList) => 
      pl.id === assignment.priceListId
    ) || null
  } catch (error) {
    console.error('Error loading price list:', error)
    return null
  }
}

/**
 * Get volume breaks for a product from a price list
 */
export function getProductVolumeBreaks(
  productId: string, 
  priceList: PriceList | null
) {
  if (!priceList) return []
  
  const rule = priceList.rules.find(r => r.productId === productId)
  return rule?.volumeBreaks || []
}

/**
 * Format tier label for display
 */
export function formatTierLabel(tier: string): string {
  const tierMap: Record<string, string> = {
    'tier-1': 'Bronze',
    'tier-2': 'Silver', 
    'tier-3': 'Gold'
  }
  return tierMap[tier] || tier
}

/**
 * Get tier color classes
 */
export function getTierColorClasses(tier: string): string {
  const colorMap: Record<string, string> = {
    'tier-1': 'bg-orange-100 text-orange-800 border-orange-200',
    'tier-2': 'bg-gray-100 text-gray-800 border-gray-200',
    'tier-3': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
  return colorMap[tier] || ''
}