import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminAuthProvider } from './auth/AdminAuthContext'
import AdminLogin from './auth/AdminLogin'
import AdminProtectedRoute from './auth/AdminProtectedRoute'
import AdminRoleGuard from './auth/AdminRoleGuard'
import CRMLayout from './layout/CRMLayout'

import CRMDashboard from './dashboard/CRMDashboard'
import CRMProducts from './products/CRMProducts'
import CRMInventory from './inventory/CRMInventory'
import CRMOrders from './orders/CRMOrders'
import CRMCustomers from './customers/CRMCustomers'
import CRMReviews from './reviews/CRMReviews'
import CRMBlogs from './blogs/CRMBlogs'
import CRMAnalytics from './analytics/CRMAnalytics'
import CRMStaff from './staff/CRMStaff'
import CRMSettings from './settings/CRMSettings'

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route element={<CRMLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CRMDashboard />} />
            <Route path="products" element={<CRMProducts />} />
            <Route path="inventory" element={<CRMInventory />} />
            <Route path="orders" element={<CRMOrders />} />
            <Route path="customers" element={<CRMCustomers />} />
            <Route path="reviews" element={<CRMReviews />} />
            <Route path="blogs" element={<CRMBlogs />} />

            <Route element={<AdminRoleGuard allow={['super_admin']} />}>
              <Route path="analytics" element={<CRMAnalytics />} />
              <Route path="staff" element={<CRMStaff />} />
              <Route path="settings" element={<CRMSettings />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}

