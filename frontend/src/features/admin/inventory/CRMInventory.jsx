import CRMPageHeader from '../shared/CRMPageHeader'
import CRMUnavailableState from '../shared/CRMUnavailableState'

export default function CRMInventory() {
  return (
    <div className="space-y-6">
      <CRMPageHeader
        title="Inventory"
        subtitle="Stock and low-stock alerts."
      />

      <CRMUnavailableState
        title="Inventory view is not available yet"
        message="The backend does not provide an admin inventory/variants listing endpoint, and the admin products endpoint does not include variants/stock. This page will be enabled once an inventory endpoint is added (or admin products includes variant stock)."
        details={[
          'Missing: GET /api/v1/admin/inventory (or similar)',
          'Or: include variants + stock in GET /api/v1/admin/products',
          'DB already supports: product_variants.stock_quantity, low_stock_alert, sku, images[]',
        ].join('\n')}
      />
    </div>
  )
}

