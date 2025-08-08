'use client'

import { Quote } from '@/types/quote-types'
import { format } from 'date-fns'

export function generateQuotePDF(quote: Quote): string {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Quote ${quote.number}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #3b82f6;
        }
        .company-info {
          flex: 1;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .quote-info {
          text-align: right;
        }
        .quote-number {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }
        .quote-date {
          color: #666;
          font-size: 14px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #10b981;
          color: white;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-block {
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .items-table th {
          background: #f3f4f6;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
          border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .items-table .text-right {
          text-align: right;
        }
        .pricing-summary {
          margin-top: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .pricing-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .pricing-row.total {
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid #333;
          margin-top: 10px;
          padding-top: 15px;
        }
        .terms-section {
          margin-top: 40px;
          padding: 20px;
          background: #eff6ff;
          border-radius: 8px;
          border: 1px solid #bfdbfe;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .signature-block {
          margin-top: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .signature-line {
          border-bottom: 1px solid #333;
          margin-bottom: 5px;
          min-height: 40px;
        }
        .signature-label {
          font-size: 12px;
          color: #666;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <div class="company-name">Your Company Name</div>
          <div>123 Business Street</div>
          <div>City, State 12345</div>
          <div>Phone: (555) 123-4567</div>
          <div>Email: sales@company.com</div>
        </div>
        <div class="quote-info">
          <div class="quote-number">${quote.number}</div>
          <div class="quote-date">Date: ${format(new Date(quote.createdAt), 'MMMM d, yyyy')}</div>
          <div class="quote-date">Valid Until: ${format(new Date(quote.terms.validUntil), 'MMMM d, yyyy')}</div>
          <div class="status-badge">${quote.status.toUpperCase()}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="info-grid">
          <div class="info-block">
            <div class="info-label">Company</div>
            <div class="info-value">${quote.companyName}</div>
          </div>
          ${quote.contactName ? `
          <div class="info-block">
            <div class="info-label">Contact Person</div>
            <div class="info-value">${quote.contactName}</div>
          </div>
          ` : ''}
          ${quote.contactEmail ? `
          <div class="info-block">
            <div class="info-label">Email</div>
            <div class="info-value">${quote.contactEmail}</div>
          </div>
          ` : ''}
          ${quote.referenceNumber ? `
          <div class="info-block">
            <div class="info-label">Reference Number</div>
            <div class="info-value">${quote.referenceNumber}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Quote Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Discount</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${quote.items.map(item => `
              <tr>
                <td>
                  <strong>${item.productName}</strong>
                  ${item.variant ? `<br><small>Size: ${item.variant.size || 'N/A'}, Color: ${item.variant.color || 'N/A'}</small>` : ''}
                  ${item.notes ? `<br><small>${item.notes}</small>` : ''}
                </td>
                <td>${item.sku}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
                <td class="text-right">${item.discount}%</td>
                <td class="text-right">$${item.total.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="pricing-summary">
          <div class="pricing-row">
            <span>Subtotal:</span>
            <span>$${quote.pricing.subtotal.toLocaleString()}</span>
          </div>
          ${quote.pricing.discount > 0 ? `
          <div class="pricing-row">
            <span>Discount (${quote.pricing.discountPercentage.toFixed(0)}%):</span>
            <span>-$${quote.pricing.discount.toLocaleString()}</span>
          </div>
          ` : ''}
          <div class="pricing-row">
            <span>Tax (${quote.pricing.taxRate}%):</span>
            <span>$${quote.pricing.tax.toLocaleString()}</span>
          </div>
          ${quote.pricing.shipping > 0 ? `
          <div class="pricing-row">
            <span>Shipping:</span>
            <span>$${quote.pricing.shipping.toLocaleString()}</span>
          </div>
          ` : ''}
          <div class="pricing-row total">
            <span>Total:</span>
            <span>$${quote.pricing.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div class="terms-section">
        <div class="section-title">Terms & Conditions</div>
        <div class="info-grid">
          <div>
            <div class="info-label">Payment Terms</div>
            <div class="info-value">${quote.terms.paymentTerms.replace('-', ' ').toUpperCase()}</div>
          </div>
          <div>
            <div class="info-label">Shipping Terms</div>
            <div class="info-value">${quote.terms.shippingTerms.replace('-', ' ').toUpperCase()}</div>
          </div>
          ${quote.terms.deliveryDate ? `
          <div>
            <div class="info-label">Requested Delivery</div>
            <div class="info-value">${format(new Date(quote.terms.deliveryDate), 'MMMM d, yyyy')}</div>
          </div>
          ` : ''}
        </div>
        ${quote.terms.notes ? `
        <div style="margin-top: 20px;">
          <div class="info-label">Notes</div>
          <div style="margin-top: 8px;">${quote.terms.notes}</div>
        </div>
        ` : ''}
      </div>

      <div class="signature-block">
        <div>
          <div class="signature-line"></div>
          <div class="signature-label">Customer Signature</div>
        </div>
        <div>
          <div class="signature-line"></div>
          <div class="signature-label">Date</div>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>This quote is valid until ${format(new Date(quote.terms.validUntil), 'MMMM d, yyyy')}</p>
        <p>Quote ID: ${quote.id} | Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}</p>
      </div>
    </body>
    </html>
  `

  return html
}

export function downloadQuotePDF(quote: Quote) {
  const html = generateQuotePDF(quote)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')
  
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}