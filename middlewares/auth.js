


const User = require('../models/userModel')

module.exports = {




// ===============================< Admin >================================//


isAdmin :(req, res, next) => {
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


// ===============================< Doctor >================================//



isDoctor :(req, res, next) => {
    console.log(req.session.doctor,'........')
    if(req.session.doctor) {
        req.doctor = req.session.doctor   //after logg
        next()
    }else{
        res.redirect('/doctor/login')
    }
},


isDoctorLogged : (req, res, next) => {
    if (!req.session.doctor) {
        next()                               //before logg
    } else {
        res.redirect('/doctor/dashboard')
    }
},


// isDoctorVerified: async (req, res, next) => {
//     const user = await User.findById(req.user); 
//     if (user.is_doctor === 1) {
//         next();
//     } else {
//         res.redirect('/doctor/login');
//     }
// },




// ===============================< Volunteer >================================//

 isLogout : (req, res, next) => {
    if (!req.session.volunteer) {
        next()
    } else {                          //before logg
        res.redirect('/')
    }
},

isLogged: (req, res, next) => {
    if (req.session.volunteer) {               //after logg
        req.user = req.session.volunteer
        next()
    } else {
        res.redirect('/login')
    }
},

isVolunteerVerified : async  (req,res,next) => {
    const user = await User.findById(req.user)
    if (user.is_varified === 1) {
        next()
    } else {
        res.redirect('/login')
    }
},


// ===============================< L-Staff >================================//


isLaboratoryStaff :(req,res,next) => {
    if(req.session.LaboratoryStaff){ 
        req.LaboratoryStaff = req.session.LaboratoryStaff
        next()
    }else {
        res.redirect('/staff/login')
    }
},

loggedOutLaboratoryStaff :(req,res,next) => {
    if(!req.session.LaboratoryStaff){
        next()
    }else {
        res.redirect('/staff/dashboard')
    }
},


// ===============================< visitor >================================//



isVisitor :(req,res,next) => {
    if(req.session.visitor){ 
        req.visitor = req.session.visitor
        next()
    }else {
        res.redirect('/visitor/login')
    }
},

loggedOutVisitor :(req,res,next) => {
    if(!req.session.visitor){
        next()
    }else {
        res.redirect('/visitor/index')
    }
},

// isVisitorVerified : async  (req,res,next) => {
//     const user = await User.findById(req.user)
//     if (user.is_visitor === 1) {
//         next()
//     } else {
//         res.redirect('/login')
//     }
// },


isVisitorVerified: async (req, res, next) => {
    try {
        // Check if req.user exists and is populated with user data
        if (req.user && req.user._id) {
            const user = await User.findById(req.user._id);
            if (user && user.is_visitor === 1) {
                next();
            } else {
                res.redirect('/visitor/login'); // Redirect to login if user is not a verified visitor
            }
        } else {
            res.redirect('/visitor/login'); // Redirect to login if req.user is not set
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}

    


}