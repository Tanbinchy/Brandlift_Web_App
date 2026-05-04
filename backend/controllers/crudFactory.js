const { protect } = require('../middleware/auth');

/**
 * Creates standard CRUD routes for a Mongoose model.
 * Public: GET all, GET by id
 * Protected: POST, PUT, DELETE
 */
const createCRUDRoutes = (router, Model, options = {}) => {
  const { publicFields, sortField = 'order', searchField, extraPublicFilter = {} } = options;

  // GET all (public)
  router.get('/', async (req, res) => {
    try {
      const filter = { ...extraPublicFilter };
      if (searchField && req.query.q) {
        filter[searchField] = { $regex: req.query.q, $options: 'i' };
      }
      if (req.query.category) filter.category = req.query.category;
      if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';

      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip  = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Model.find(filter).sort({ [sortField]: 1, createdAt: -1 }).skip(skip).limit(limit),
        Model.countDocuments(filter),
      ]);

      res.json({ data, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // GET by id (public)
  router.get('/:id', async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // POST (admin only)
  router.post('/', protect, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // PUT (admin only)
  router.put('/:id', protect, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE (admin only)
  router.delete('/:id', protect, async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};

module.exports = createCRUDRoutes;
