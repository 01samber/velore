import { Outlet, useLocation } from 'react-router-dom'
import CRMSidebar from './CRMSidebar'
import CRMTopbar from './CRMTopbar'

export default function CRMLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <div className="flex">
        <CRMSidebar />
        <div className="flex-1 min-w-0">
          <CRMTopbar pathname={location.pathname} />
          <main className="px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

