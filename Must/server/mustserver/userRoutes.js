// Must/server/mustserver/userRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

// ユーザー一覧を取得
router.get('/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM users');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'ユーザー一覧の取得に失敗しました。' });
    }
});

// ユーザーを追加
router.post('/users', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
        await connection.end();
        res.status(201).json({ message: 'ユーザーが追加されました。' });
    } catch (error) {
        res.status(500).json({ message: 'ユーザーの追加に失敗しました。' });
    }
});

// ユーザーを削除
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('DELETE FROM users WHERE id = ?', [id]);
        await connection.end();
        res.json({ message: 'ユーザーが削除されました。' });
    } catch (error) {
        res.status(500).json({ message: 'ユーザーの削除に失敗しました。' });
    }
});

module.exports = router;