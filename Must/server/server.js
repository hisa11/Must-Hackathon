const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./config');
const initializeDatabase = require('./init_db');
const path = require('path');

const app = express();
const PORT = config.port;
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes'); // userRoutes をインポート
const SECRET_KEY = config.secretKey;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/auth', userRoutes); // userRoutes を設定

const dbConfig = config.dbConfig;

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('MySQL connected successfully');
        return connection;
    } catch (error) {
        console.error('MySQL connection error:', error);
        throw error;
    }
}

// サーバー起動時にデータベースを初期化
initializeDatabase();

// サインアップエンドポイント
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const connection = await connectToDatabase();

    try {
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'ユーザー名は既に使用されています。' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        res.status(201).json({ success: true, message: 'サインアップ成功！' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'サインアップ中にエラーが発生しました。' });
    } finally {
        await connection.end();
    }
});

// ログインエンドポイント
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const connection = await connectToDatabase();

    try {
        const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        console.log('Query executed, users found:', users); // ログ追加

        if (users.length === 0) {
            console.log('No user found with username:', username); // ログ追加
            return res.status(400).json({ success: false, message: 'ユーザー名またはパスワードが間違っています。' });
        }

        const user = users[0];
        console.log('User found:', user); // ログ追加

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', isPasswordValid); // ログ追加

        if (!isPasswordValid) {
            console.log('Invalid password for username:', username); // ログ追加
            return res.status(400).json({ success: false, message: 'ユーザー名またはパスワードが間違っています。' });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        console.log('Token generated:', token); // ログ追加
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'ログイン中にエラーが発生しました。' });
    } finally {
        await connection.end();
    }
});

// 管理者機能エンドポイント
app.get('/api/admin/users', async (req, res) => {
    const connection = await connectToDatabase();

    try {
        const [rows] = await connection.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'ユーザー一覧の取得に失敗しました。' });
    } finally {
        await connection.end();
    }
});

app.post('/api/admin/users', async (req, res) => {
    const { username, email, password } = req.body;
    const connection = await connectToDatabase();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'ユーザーが追加されました。' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'ユーザーの追加に失敗しました。' });
    } finally {
        await connection.end();
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await connectToDatabase();

    try {
        await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'ユーザーが削除されました。' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'ユーザーの削除に失敗しました。' });
    } finally {
        await connection.end();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}!`);
});