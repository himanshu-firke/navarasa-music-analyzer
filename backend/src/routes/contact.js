const express = require('express')
const router = express.Router()
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController')

// POST /api/contact - Submit contact form
router.post('/', submitContact)

// GET /api/contact - Get all contacts (admin)
router.get('/', getAllContacts)

// GET /api/contact/:id - Get specific contact (admin)
router.get('/:id', getContactById)

// PATCH /api/contact/:id - Update contact status (admin)
router.patch('/:id', updateContactStatus)

// DELETE /api/contact/:id - Delete contact (admin)
router.delete('/:id', deleteContact)

module.exports = router
