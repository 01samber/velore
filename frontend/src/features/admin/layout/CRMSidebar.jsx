import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react'

import { useAdminAuth } from '../auth/AdminAuthContext'

function normalizeRole(role) {
  if (!role) return null
  if (role === 'admin') return 'staff_admin'
  return role
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-300 hover:text-white hover:bg-white/5',
        ].join(' ')
      }
    >
      <Icon className="w-[18px] h-[18px] shrink-0 opacity-90 group-hover:opacity-100" />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function CRMSidebar() {
  const { admin, logout } = useAdminAuth()
  const role = normalizeRole(admin?.role)
  const isSuper = role === 'super_admin'

  const primary = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, show: isSuper },
    { to: '/admin/products', label: 'Products', icon: Package, show: true },
    { to: '/admin/inventory', label: 'Inventory', icon: Boxes, show: true },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, show: true },
    { to: '/admin/customers', label: 'Customers', icon: Users, show: true },
    { to: '/admin/reviews', label: 'Reviews', icon: Star, show: true },
    { to: '/admin/blogs', label: 'Blogs', icon: Newspaper, show: true },
    { to: '/admin/staff', label: 'Staff', icon: ShieldCheck, show: isSuper },
    { to: '/admin/settings', label: 'Settings', icon: Settings, show: isSuper },
  ].filter((x) => x.show)

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:sticky lg:top-0 lg:h-screen bg-[#0b1220] border-r border-white/5">
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white font-bold shadow-sm">
            V
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold tracking-wide truncate">Velore CRM</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-widest truncate">
              Admin Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-semibold">
            {(admin?.email || 'A')[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-white font-medium truncate">{admin?.email}</div>
            <div className="text-[11px] text-slate-400 capitalize truncate">
              {role === 'super_admin' ? 'Super Admin' : 'Staff Admin'}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {primary.map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/5">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

