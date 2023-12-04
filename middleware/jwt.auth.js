const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyUser(req, res, next) {
  let token = req.header('Authorization');
  token = token.includes('Bearer') ? token.split('Bearer ')[1] : token;
  if (!token) return res.status(401).json({ message: 'Your session has been expired, please login again' });
  jwt.verify(token, process.env.SECRET_KEY, { algorithm: 'HS256' }, (err, user) => {
    if (err) return res.status(403).json({ message: 'Your token has been expired, please login again' });
    req.user = user;
    next();
  });
}

module.exports = verifyUser;