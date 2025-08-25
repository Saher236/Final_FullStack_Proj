// server/middleware/auth.js
// Middleware: validates JWT token and ensures user is an admin
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_in_prod';

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Allow only admin users
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only' });
    }

    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
