const bcrypt = require('bcrypt');
const connectToDatabase = require('./database');

// パスワードリセット用の関数
exports.resetPassword = async (req, res) => {
    const { username, email, newPassword } = req.body;
    const connection = await connectToDatabase();

    try {
        const [user] = await connection.execute('SELECT * FROM users WHERE username = ? AND email = ?', [username, email]);
        if (user.length === 0) {
            return res.status(400).json({ success: false, message: 'ユーザー名またはメールアドレスが間違っています。' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute('UPDATE users SET password = ? WHERE username = ? AND email = ?', [hashedPassword, username, email]);

        res.status(200).json({ success: true, message: 'パスワード再設定成功！' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ success: false, message: 'パスワード再設定中にエラーが発生しました。' });
    } finally {
        await connection.end();
    }
};

// プロフィール取得用の関数
exports.getProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: '認証されていません' });
    }

    const userId = req.user.userId; // 認証ミドルウェアで設定されたユーザーIDを取得

    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT username, email FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'ユーザーが見つかりません' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'ユーザープロフィールの取得に失敗しました' });
    }
};

// プロフィール更新用の関数
exports.updateProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: '認証されていません' });
    }

    const userId = req.user.userId; // 認証ミドルウェアで設定されたユーザーIDを取得
    const { username, email } = req.body;

    try {
        const connection = await connectToDatabase();
        await connection.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId]);

        res.status(200).json({ success: true, message: 'プロフィール更新成功！' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'プロフィール更新中にエラーが発生しました。' });
    }
};