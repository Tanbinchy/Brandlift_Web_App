const router  = require('express').Router();
const Booking = require('../models/Booking');
const { userProtect, protect } = require('../middleware/auth');

// ── USER: Create booking ───────────────────────────────────────────────────
router.post('/', userProtect, async (req, res) => {
  try {
    const { serviceName, service, date, time, message } = req.body;
    if (!serviceName || !date || !time) return res.status(400).json({ message: 'Service, date and time are required' });
    const booking = await Booking.create({ user: req.user._id, serviceName, service, date, time, message });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── USER: Get my bookings ──────────────────────────────────────────────────
router.get('/my', userProtect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('service', 'title icon');
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Get all bookings ────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).populate('user', 'name email phone');
    res.json({ data: bookings, total: bookings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Get single booking ──────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Update booking (status, note, invoice) ─────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Delete booking ──────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── USER: Cancel own booking ───────────────────────────────────────────────
router.put('/:id/cancel', userProtect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (['completed','cancelled'].includes(booking.status)) return res.status(400).json({ message: `Cannot cancel a ${booking.status} booking` });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
