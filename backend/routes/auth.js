const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const Admin  = require('../models/Admin');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign(
  { id, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

router.post('/setup', async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body;
    if (setupKey !== process.env.ADMIN_SETUP_KEY) return res.status(403).json({ message: 'Invalid setup key' });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ message: 'Admin created', token: signToken(admin._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(admin._id), admin: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', protect, (req, res) => res.json(req.admin));

router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (!(await admin.matchPassword(currentPassword))) return res.status(401).json({ message: 'Current password incorrect' });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
