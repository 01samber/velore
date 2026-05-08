const router = require('express').Router()
const adminController = require('./admin.controller')
const { adminAuthMiddleware } = require('../../shared/middleware/middleware')
const rbac = require('../rbac')

// ─── Public ────────────────────────────────────────────────────
router.post('/login', adminController.login)

// ─── All routes below require admin JWT ────────────────────────
router.use(adminAuthMiddleware)

// Dashboard
router.get('/dashboard', rbac.requirePermission('read:dashboard_operational'), adminController.getDashboard)

// Analytics (Super Admin only)
router.get('/analytics', rbac.requirePermission('read:analytics'), rbac.requireSuperAdmin, adminController.getAnalytics)

// Users
router.get('/users', rbac.requirePermission('read:customers'), adminController.getUsers)
router.get('/users/:userId', rbac.requirePermission('read:customers'), adminController.getUser)
router.patch('/users/:userId/toggle-status', rbac.requirePermission('write:customers_status'), adminController.toggleUserStatus)
router.delete('/users/:userId', rbac.requirePermission('delete:customers'), adminController.deleteUser)

// Products
router.get('/products', rbac.requirePermission('read:products'), adminController.getProducts)
router.patch('/products/:productId/toggle-status', rbac.requirePermission('write:products'), adminController.toggleProductStatus)
router.delete('/products/:productId', rbac.requirePermission('delete:products'), adminController.deleteProduct)

// Orders
router.get('/orders', rbac.requirePermission('read:orders'), adminController.getOrders)
router.patch('/orders/:orderId/status', rbac.requirePermission('write:orders'), adminController.updateOrderStatus)

// Audit Logs
router.get('/audit-logs', rbac.requirePermission('read:audit_logs'), adminController.getAuditLogs)

// Admins management
router.get('/admins', rbac.requireSuperAdmin, adminController.getAdmins)

// Super Admin only — create new admin
router.post('/admins', rbac.requireSuperAdmin, adminController.createAdmin)

module.exports = router