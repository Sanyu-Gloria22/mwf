// Ensure user is authenticated
exports.ensureauthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");   // redirect to login if not logged in
};

// Ensure user is a sales agent
exports.ensureAttendant = (req, res, next) => {
  if (req.session.user && req.session.user.role.toLowerCase() === "attendant") {
    return next();
  }
  res.redirect("/login");
};

// Ensure user is a manager
exports.ensureManager = (req, res, next) => {
  if (req.session.user && req.session.user.role.toLowerCase() === "manager") {
    return next();
  }
  res.redirect("/login");  
};
