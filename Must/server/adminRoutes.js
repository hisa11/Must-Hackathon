const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

// 管理者用のエンドポイント
router.post('/login', adminController.login);
router.post('/createUser', adminController.createUser);

module.exports = router;