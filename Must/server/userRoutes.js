const express = require('express');
const router = express.Router();
const userController = require('./userController');

// ユーザー用のエンドポイント
router.post('/password_reset', userController.resetPassword);

module.exports = router;