const router = require('express').Router();
const { Blog } = require('../models');
const { protect } = require('../middleware/auth');
const createCRUDRoutes = require('../controllers/crudFactory');

// Slug route (before generic :id)
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.views = (post.views || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all (including drafts)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json({ data: posts, total: posts.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

createCRUDRoutes(router, Blog, {
  sortField: 'publishedAt',
  searchField: 'title',
  extraPublicFilter: { isPublished: true },
});

module.exports = router;
