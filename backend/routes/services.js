// services.js
const router = require('express').Router();
const { Service } = require('../models');
const createCRUDRoutes = require('../controllers/crudFactory');
createCRUDRoutes(router, Service, { sortField: 'order', extraPublicFilter: { isActive: true } });
module.exports = router;
