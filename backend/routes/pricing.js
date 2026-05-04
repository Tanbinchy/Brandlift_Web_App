const router = require('express').Router();
const { Pricing } = require('../models');
const createCRUDRoutes = require('../controllers/crudFactory');
createCRUDRoutes(router, Pricing, { sortField: 'order', extraPublicFilter: { isActive: true } });
module.exports = router;
