const router = require('express').Router();
const { Testimonial } = require('../models');
const createCRUDRoutes = require('../controllers/crudFactory');
createCRUDRoutes(router, Testimonial, { sortField: 'createdAt', extraPublicFilter: { isActive: true } });
module.exports = router;
