const Contact = require('../models/contact');

// POST /api/contact — save contact form message (public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ status: 'fail', error: 'Name, email, and message are required' });
    }
    const contact = await Contact.create({ name, email, phone: phone || '', subject: subject || '', message });
    res.status(201).json({ status: 'success', data: { contact } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};
