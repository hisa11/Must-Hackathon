const bcrypt = require('bcrypt');
const { connectToDatabase } = require('./config');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const connection = await connectToDatabase();

    try {
        const [admin] = await connection.execute('SELECT * FROM admins WHERE username = ?', [username]);
        if (admin.length === 0) {
            return res.status(400).json({ success: false, message: 'ユーザー名またはパスワードが間違っています。' });
        }

        const validPassword = await bcrypt.compare(password, admin[0].password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'ユーザー名またはパスワードが間違っています。' });
        }

        res.status(200).json({ success: true, message: 'ログイン成功！' });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ success: false, message: 'ログイン中にエラーが発生しました。' });
    } finally {
        await connection.end();
    }
};

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const connection = await connectToDatabase();

    try {
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'ユーザー名は既に使用されています。' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        res.status(201).json({ success: true, message: 'ユーザー作成成功！' });
    } catch (error) {
        console.error('Error during user creation:', error);
        res.status(500).json({ success: false, message: 'ユーザー作成中にエラーが発生しました。' });
    } finally {
        await connection.end();
    }
};

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