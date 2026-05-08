const permissionAliases = {
  // Dashboard
  'read:dashboard': 'read:dashboard_operational',

  // Legacy naming from /api/v1/admin routes
  'read:users': 'read:customers',
  'update:users': 'write:customers_status',
  'delete:users': 'delete:customers',

  // Legacy product writes
  'create:products': 'write:products',
  'update:products': 'write:products',

  // Legacy order writes
  'update:orders': 'write:orders',

  // Legacy brand/category writes
  'create:brands': 'write:brands',
  'update:brands': 'write:brands',
  'delete:brands': 'write:brands',
  'create:categories': 'write:categories',
  'update:categories': 'write:categories',
  'delete:categories': 'write:categories'
}

function normalizePermission(permission) {
  return permissionAliases[permission] || permission
}

const rbac = {
  roles: {
    super_admin: ['*'],

    // CRM role (preferred)
    staff_admin: [
      // Operational dashboard only (no revenue/KPIs)
      'read:dashboard_operational',

      // Products + inventory
      'read:products',
      'write:products',
      'read:inventory',
      'write:inventory',

      // Orders
      'read:orders',
      'write:orders',

      // Customers
      'read:customers',
      'write:customers_status',

      // Reviews
      'read:reviews',
      'moderate:reviews',

      // Blogs
      'read:blogs',
      'write:blogs',

      // Audit logs (operational)
      'read:audit_logs'
    ],

    // Legacy role (treated as staff-equivalent for now)
    admin: [
      'read:dashboard_operational',
      'read:products',
      'write:products',
      'read:inventory',
      'write:inventory',
      'read:orders',
      'write:orders',
      'read:customers',
      'write:customers_status',
      'read:reviews',
      'moderate:reviews',
      'read:blogs',
      'write:blogs',
      'read:audit_logs'
    ],

    customer: []
  },

  hasPermission(role, permission) {
    const permissions = this.roles[role] || []
    const normalized = normalizePermission(permission)

    if (permissions.includes('*')) return true
    if (permissions.includes(normalized)) return true

    // Back-compat: if the route still requests an old permission name,
    // allow if the role has the normalized permission.
    if (normalized !== permission && permissions.includes(permission)) return true

    return false
  },

  requirePermission(permission) {
    return (req, res, next) => {
      const role = req.admin?.role
      if (!role) {
        return res.status(403).json({ success: false, message: 'Access denied', errors: [] })
      }
      if (!this.hasPermission(role, permission)) {
        const normalized = normalizePermission(permission)
        return res.status(403).json({
          success: false,
          message: 'Missing permission: ' + normalized,
          errors: []
        })
      }
      next()
    }
  },

  requireSuperAdmin(req, res, next) {
    if (req.admin?.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Super admin access required',
        errors: []
      })
    }
    next()
  }
}

module.exports = rbac