const router = require('express').Router();
const { Contact } = require('../models');
const { protect } = require('../middleware/auth');

// POST /api/contacts (public — form submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ message: 'All required fields must be filled' });
    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Message sent successfully!', id: contact._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only routes
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({ data: contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { $set: { status: 'read' } }, { new: true });
    if (!contact) return res.status(404).json({ message: 'Not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ message: 'Not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
