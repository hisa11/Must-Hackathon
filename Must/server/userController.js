const bcrypt = require('bcrypt');
const connectToDatabase = require('./database');

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