const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

router.get('/api/admin/users', adminController.viewUsers);
router.post('/api/admin/users', adminController.addUser);

module.exports = router;