const bcrypt = require('bcrypt');
const { connectToDatabase } = require('./config');

exports.viewUsers = async (req, res) => {
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
};

exports.addUser = async (req, res) => {
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
};

exports.deleteUser = async (req, res) => {
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
};