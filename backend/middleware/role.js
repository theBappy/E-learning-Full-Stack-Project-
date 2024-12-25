const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware to check if user has the correct role
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // 1. Get the JWT token from the request header
      const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is in Bearer format
      if (!token) {
        return res.status(403).json({ message: 'Access denied, token missing!' });
      }

      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 3. Check if the user's role matches the required roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'You do not have permission to access this resource.' });
      }

      // 4. Attach user to the request object
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = checkRole;
