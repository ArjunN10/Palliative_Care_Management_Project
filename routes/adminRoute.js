const router = require("express").Router()

const adminController=require("../controllers/adminController")
const medicineController=require("../controllers/medicineController")
const TrycatchMiddleware=require("../middlewares/TryCatch")

const {isAdmin,loggedInAdmin}=require("../middlewares/auth")



router


.get("/login", loggedInAdmin,TrycatchMiddleware(adminController.loadLogin) )
.post("/login", loggedInAdmin, TrycatchMiddleware(adminController.AdminLogin))

.get("/dashboard",isAdmin,TrycatchMiddleware(adminController.AdminDashboard));





module.exports=router