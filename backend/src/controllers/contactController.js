const Contact = require('../models/Contact')

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      })
    }

    // Create contact entry
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    })

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: contact._id,
        createdAt: contact.createdAt
      }
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    })
  }
}

// Get all contact submissions (admin)
exports.getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const status = req.query.status

    const query = {}
    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Contact.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    })
  }
}

// Get contact by ID (admin)
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params

    const contact = await Contact.findById(id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    // Mark as read
    if (contact.status === 'new') {
      contact.status = 'read'
      await contact.save()
    }

    res.status(200).json({
      success: true,
      data: contact
    })
  } catch (error) {
    console.error('Get contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: error.message
    })
  }
}

// Update contact status (admin)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      })
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: contact
    })
  } catch (error) {
    console.error('Update contact status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    })
  }
}

// Delete contact (admin)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params

    const contact = await Contact.findByIdAndDelete(id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    })
  } catch (error) {
    console.error('Delete contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message
    })
  }
}
