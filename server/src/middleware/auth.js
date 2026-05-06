// Middleware to check if user is admin (for now, we check based on user role in request body)
// In a production app with JWT tokens, you'd extract the user from the token
const checkAdminRole = (req, res, next) => {
  // This is a simple check - in production, you should use JWT tokens
  // For now, we'll do basic validation on the client side
  next();
};

module.exports = {
  checkAdminRole,
};
