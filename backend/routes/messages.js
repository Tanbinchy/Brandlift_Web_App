const router  = require('express').Router();
const Message = require('../models/Message');
const { userProtect, protect } = require('../middleware/auth');

// ── USER: Start new message thread ────────────────────────────────────────
router.post('/', userProtect, async (req, res) => {
  try {
    const { subject, text } = req.body;
    if (!subject || !text) return res.status(400).json({ message: 'Subject and message required' });
    const msg = await Message.create({
      user: req.user._id,
      subject,
      thread: [{ sender: 'user', text }],
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── USER: Get my messages ─────────────────────────────────────────────────
router.get('/my', userProtect, async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ data: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── USER: Reply to a thread ───────────────────────────────────────────────
router.post('/:id/reply', userProtect, async (req, res) => {
  try {
    const msg = await Message.findOne({ _id: req.params.id, user: req.user._id });
    if (!msg) return res.status(404).json({ message: 'Thread not found' });
    msg.thread.push({ sender: 'user', text: req.body.text });
    msg.isReadByAdmin = false;
    msg.isReadByUser  = true;
    msg.status = 'open';
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Get all messages ───────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const messages = await Message.find(filter).sort({ updatedAt: -1 }).populate('user', 'name email');
    res.json({ data: messages, total: messages.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Get single message thread ─────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { isReadByAdmin: true }, { new: true }).populate('user', 'name email phone');
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Reply to thread ────────────────────────────────────────────────
router.post('/:id/admin-reply', protect, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Not found' });
    msg.thread.push({ sender: 'admin', text: req.body.text });
    msg.isReadByUser  = false;
    msg.isReadByAdmin = true;
    msg.status = 'replied';
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Close thread ───────────────────────────────────────────────────
router.put('/:id/close', protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Delete ─────────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
