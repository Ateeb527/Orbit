const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // 1. Grab the token from the incoming request header (The Bouncer checking the ID)
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.error("🔥 Auth Middleware: No token provided in headers!");
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // 2. Verify it using the exact same secret key
    req.user = jwt.verify(token, process.env.JWT_SECRET || '123456789abcdef');
    next();
  } catch (err) {
    console.error("🔥 Auth Middleware Error:", err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const role = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

module.exports = { auth, role };