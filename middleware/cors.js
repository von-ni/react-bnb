module.exports = function (req, res, next) {
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // Allow specified headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
  // Handle preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next(); // Move to the next middleware or route handler
  }
};
