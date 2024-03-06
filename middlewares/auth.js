const User = require('../models/userModel')

module.exports = {
 isLogout : (req, res, next) => {
    if (!req.session.user) {
        next()
    } else {
        res.redirect('/')
    }
},

isLogged: (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user
        next()
    } else {
        res.redirect('/login')
    }
},

// Doctor

isDoctor :(req, res, next) => {
    if(req.session.doctor) {
        req.doctor = req.session.doctor 
        next()
    }else{
        res.redirect('/doctor/login')
    }
},

 loggedOutDoctor:  (req, res, next) => {
    if(!req.session.doctor){
        next()
    }else{
        res.redirect('/doctor/dashboard')
    }
},

 isVerified : async  (req,res,next) => {
    const user = await User.findById(req.user)
    if (user.is_varified === 1) {
        next()
    } else {
        res.redirect('/login')
    }
},



// Admin

isAdmin :(req, res, next) => {
    console.log(req.session.admin,"isAdminSession")
    if(req.session.admin) {
        req.admin = req.session.admin 
        next()
    }else{
        res.redirect('/admin/login')
    }
},

 loggedInAdmin:  (req,res,next) => {
    if(!req.session.admin){
        next()
    }else{
        res.redirect('/admin/dashboard')
    }
},


    
}