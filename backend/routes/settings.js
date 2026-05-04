const router = require('express').Router();
const { Settings } = require('../models');
const { protect } = require('../middleware/auth');

// GET all settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT upsert a setting (admin)
router.put('/:key', protect, async (req, res) => {
  try {
    const { value, group } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value, group: group || 'general' },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT bulk update settings (admin)
router.put('/', protect, async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: { filter: { key }, update: { key, value }, upsert: true }
    }));
    await Settings.bulkWrite(ops);
    res.json({ message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
