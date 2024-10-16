const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

// 管理者用のエンドポイント
router.get('/users', adminController.viewUsers);
router.post('/users', adminController.addUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;