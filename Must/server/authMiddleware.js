const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // トークンがない場合は401 Unauthorizedを返す
    }

    jwt.verify(token, config.secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // トークンが無効な場合は403 Forbiddenを返す
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;