const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyUser(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Your session has been expired, please login again' });
  jwt.verify(token, process.env.SECRET_KEY , (err, user) => {
    if (err) return res.status(403).json({ message: 'Your token has been expired, please login again' });
    req.user = user;
    next();
  });
}

module.exports = verifyUser;