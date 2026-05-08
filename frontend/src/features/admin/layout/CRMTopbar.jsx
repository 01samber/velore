import { useMemo } from 'react'
import { useAdminAuth } from '../auth/AdminAuthContext'

function titleFromPath(pathname) {
  const map = {
    '/admin/dashboard': 'Dashboard',
    '/admin/analytics': 'Analytics',
    '/admin/products': 'Products',
    '/admin/inventory': 'Inventory',
    '/admin/orders': 'Orders',
    '/admin/customers': 'Customers',
    '/admin/reviews': 'Reviews',
    '/admin/blogs': 'Blogs',
    '/admin/staff': 'Staff',
    '/admin/settings': 'Settings',
  }
  return map[pathname] || 'Velore CRM'
}

export default function CRMTopbar({ pathname }) {
  const { admin } = useAdminAuth()
  const title = useMemo(() => titleFromPath(pathname), [pathname])
  const role = admin?.role === 'super_admin' ? 'Super Admin' : 'Staff Admin'

  return (
    <header className="sticky top-0 z-20 bg-[#f4f6fb]/80 backdrop-blur border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-slate-500">Velore CRM</div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-slate-900 text-white">
            {role}
          </span>
          <span className="hidden md:inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white border border-slate-200 text-slate-700">
            {admin?.email}
          </span>
        </div>
      </div>
    </header>
  )
}

