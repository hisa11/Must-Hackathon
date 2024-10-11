const express = require('express');
const router = express.Router();
const { resetPassword } = require('../adminController'); // パスワード再設定のコントローラーをインポート

// パスワード再設定のエンドポイント
router.post('/password_reset', resetPassword);

module.exports = router;