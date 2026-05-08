const adminService = require('./admin.service')

function jsonSuccess(res, data, message = null) {
  return res.json({ success: true, message, data })
}

function jsonError(res, status, message, errors = []) {
  return res.status(status).json({ success: false, message, errors })
}

const adminController = {

  // ─── Auth ──────────────────────────────────────────────────

  async login(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password)
        return jsonError(res, 400, 'Email and password required')

      const result = await adminService.login(email, password)
      return jsonSuccess(res, result, 'Logged in')
    } catch (error) {
      return jsonError(res, 401, error.message)
    }
  },

  async createAdmin(req, res) {
    try {
      const result = await adminService.createAdmin(req.admin.adminId, req.body)
      return res.status(201).json({ success: true, message: 'Admin created', data: result })
    } catch (error) {
      return jsonError(res, 400, error.message)
    }
  },

  // ─── Dashboard ─────────────────────────────────────────────

  async getDashboard(req, res) {
    try {
      const data = await adminService.getDashboardStats(req.admin?.role)
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 500, error.message)
    }
  },

  async getAnalytics(req, res) {
    try {
      const data = await adminService.getAnalytics()
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 500, error.message)
    }
  },

  // ─── Users ─────────────────────────────────────────────────

  async getUsers(req, res) {
    try {
      const { page, limit, search, is_active } = req.query
      const data = await adminService.getAllUsers({
        page,
        limit,
        search,
        is_active: is_active !== undefined ? is_active === 'true' : undefined
      })
      return res.json({ success: true, message: null, ...data, errors: [] })
    } catch (error) {
      return jsonError(res, 500, error.message)
    }
  },

  async getUser(req, res) {
    try {
      const data = await adminService.getUserById(req.params.userId)
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 404, error.message)
    }
  },

  async toggleUserStatus(req, res) {
    try {
      const data = await adminService.toggleUserStatus(req.admin.adminId, req.params.userId)
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 400, error.message)
    }
  },

  async deleteUser(req, res) {
    try {
      const data = await adminService.deleteUser(req.admin.adminId, req.params.userId)
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 400, error.message)
    }
  },

  // ─── Products ──────────────────────────────────────────────

  async getProducts(req, res) {
    try {
      const { page, limit, search, is_active } = req.query
      const data = await adminService.getAllProducts({
        page,
        limit,
        search,
        is_active: is_active !== undefined ? is_active === 'true' : undefined
      })
      return res.json({ success: true, message: null, ...data, errors: [] })
    } catch (error) {
      return jsonError(res, 500, error.message)
    }
  },

  async toggleProductStatus(req, res) {
    try {
      const data = await adminService.toggleProductStatus(req.admin.adminId, req.params.productId)
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 400, error.message)
    }
  },

  async deleteProduct(req, res) {
    try {
      const data = await adminService.deleteProduct(req.admin.adminId, req.params.productId)
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 400, error.message)
    }
  },

  // ─── Orders ────────────────────────────────────────────────

  async getOrders(req, res) {
    try {
      const { page, limit, status } = req.query
      const data = await adminService.getAllOrders({ page, limit, status })
      return res.json({ success: true, message: null, ...data, errors: [] })
    } catch (error) {
      return jsonError(res, 500, error.message)
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const data = await adminService.updateOrderStatus(req.admin.adminId, req.params.orderId, req.body.status)
      return jsonSuccess(res, data)
    } catch (error) {
      return jsonError(res, 400, error.message)
    }
  },

  // ─── Audit Logs ────────────────────────────────────────────

  async getAuditLogs(req, res) {
    try {
      const data = await adminService.getAuditLogs(req.query)
      return res.json({ success: true, message: null, ...data, errors: [] })
    } catch (error) {
      return jsonError(res, 500, error.message)
    }
  },

  async getAdmins(req, res) {
    try {
      const data = await adminService.getAdmins();
      return jsonSuccess(res, data);
    } catch (error) {
      return jsonError(res, 500, error.message);
    }
  }
}

module.exports = adminController