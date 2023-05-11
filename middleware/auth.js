const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // get token
  const token = req.header('x-auth-token');
  if (!token) {
    console.log('No token...authorization denied.');
    return res.status(401).json({ errors: [{ msg: 'Please login. ' }] });
  }
  // vertify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch {
    console.log('Invalid token...authorization denied.');
    res.status(401).json({ errors: [{ msg: 'Please login.' }] });
  }
};
