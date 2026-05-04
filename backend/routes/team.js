const router = require('express').Router();
const { Team } = require('../models');
const createCRUDRoutes = require('../controllers/crudFactory');
createCRUDRoutes(router, Team, { sortField: 'order', extraPublicFilter: { isActive: true } });
module.exports = router;
