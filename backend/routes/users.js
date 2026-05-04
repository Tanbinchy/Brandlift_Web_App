const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { userProtect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, projectStatus: user.projectStatus }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ message: 'Account has been disabled. Contact support.' });
    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, projectStatus: user.projectStatus, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me
router.get('/me', userProtect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('favourites', 'title category icon');
  res.json(user);
});

// PUT /api/users/profile
router.put('/profile', userProtect, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/change-password
router.put('/change-password', userProtect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) return res.status(401).json({ message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/favourites/:serviceId  (toggle)
router.post('/favourites/:serviceId', userProtect, async (req, res) => {
  try {
    const user  = await User.findById(req.user._id);
    const sid   = req.params.serviceId;
    const index = user.favourites.indexOf(sid);
    if (index > -1) {
      user.favourites.splice(index, 1);
    } else {
      user.favourites.push(sid);
    }
    await user.save();
    res.json({ favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: manage users ────────────────────────────────────────────────────
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ data: users, total: users.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('favourites', 'title category');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { isActive, projectStatus, role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive, projectStatus, role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
