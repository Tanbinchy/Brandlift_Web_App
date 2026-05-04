const router = require('express').Router();
const { Portfolio } = require('../models');
const createCRUDRoutes = require('../controllers/crudFactory');
createCRUDRoutes(router, Portfolio, { sortField: 'createdAt', searchField: 'title', extraPublicFilter: { isActive: true } });
module.exports = router;
