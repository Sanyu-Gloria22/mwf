//Ensure User is authenticated
exports.ensureauthenticated = (req, res, next) =>{
  if(req.session.user){
    return next()
  }
  res.redirect("/login")    
};

//ensure user is a salesagent
exports.ensureAgent = (req, res, next) =>{
  if(req.session.user && req.session.user.role==="Attendant"){
    return next()
  }
  res.redirect("/")    
}

//ensure user is a manager
exports.ensurManager = (req, res, next) =>{
  if(req.session.user){
    return next()
  }
  res.redirect("/login")    
}