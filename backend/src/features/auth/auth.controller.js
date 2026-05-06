const { validationResult } = require('express-validator')
const authService = require('./auth.service')
const prisma = require('../../shared/utils/database')

const authController = {
  async register(req, res, next) {
    try {
      // ✅ Check validation results
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array().map(e => e.msg)
        })
      }

      const result = await authService.register(req.body)
      res.status(201).json({
        success: true,
        message: 'Registered successfully',
        data: result
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        errors: []
      })
    }
  },

  async login(req, res, next) {
    try {
      // ✅ Check validation results
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array().map(e => e.msg)
        })
      }

      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.json({
        success: true,
        message: 'Logged in',
        data: result
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
        errors: []
      })
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ success: false, message: 'Email is required', errors: [] })
      await authService.forgotPassword(email)
      // Always return success (don't reveal if email exists)
      res.json({ success: true, message: 'If that email exists, a reset link has been sent.', data: null })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message, errors: [] })
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body
      if (!token || !password) return res.status(400).json({ success: false, message: 'Token and password are required', errors: [] })
      if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters', errors: [] })
      await authService.resetPassword(token, password)
      res.json({ success: true, message: 'Password updated successfully', data: null })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message, errors: [] })
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await prisma.users.findUnique({
        where: { user_id: Number(req.user.userId) },
        include: { roles: true }
      })

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found', errors: [] })
      }

      res.json({
        success: true,
        message: null,
        data: { 
          id: user.user_id, 
          email: user.email, 
          name: user.name, 
          role: user.roles?.name 
        }
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message, errors: [] })
    }
  }
}

module.exports = authController