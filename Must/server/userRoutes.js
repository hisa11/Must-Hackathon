const express = require('express');
const router = express.Router();
const userController = require('./userController');

// ユーザー用のエンドポイント
router.post('/password_reset', userController.resetPassword);

// プロフィール取得用のエンドポイント
router.get('/profile', userController.getProfile);

// プロフィール更新用のエンドポイント
router.put('/profile', userController.updateProfile);

module.exports = router;