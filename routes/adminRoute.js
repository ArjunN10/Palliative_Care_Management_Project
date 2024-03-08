const router = require("express").Router()

const adminController=require("../controllers/adminController")
const medicineController=require("../controllers/medicineController")
const TrycatchMiddleware=require("../middlewares/TryCatch")

const {isAdmin,loggedInAdmin}=require("../middlewares/auth")



router

// ===============================< Login/Logout >================================//

.get("/login", loggedInAdmin,TrycatchMiddleware(adminController.loadLogin) )
.post("/login", loggedInAdmin, TrycatchMiddleware(adminController.AdminLogin))

.post("/logout", isAdmin, TrycatchMiddleware( adminController.logoutAdmin))


// ===============================< Dashboard >================================//

.get("/dashboard",isAdmin,TrycatchMiddleware(adminController.AdminDashboard))

// ===============================< Staff Management >================================//

.post("/createVolunteers",isAdmin,TrycatchMiddleware(adminController.createVolunteer) )
.get("/createVolunteers", isAdmin,TrycatchMiddleware(adminController.ViewVolunteer) )

.get("/volunteers/:id/edit",isAdmin,TrycatchMiddleware(adminController.loadEditVolunteer) )
.put("/volunteers/:id",isAdmin,TrycatchMiddleware( adminController.updateVolunteer))
.delete("/volunteers/:id/destroy",isAdmin,TrycatchMiddleware(adminController.deleteVolunteer))

// ===============================< Doctor Management >================================//


module.exports=router