const router = require("express").Router()

const adminController=require("../controllers/adminController")
const medicineController=require("../controllers/medicineController")
const TrycatchMiddleware=require("../middlewares/TryCatch")

const {isAdmin,loggedInAdmin}=require("../middlewares/auth")



router


.get("/login",TrycatchMiddleware, loggedInAdmin, adminController.loadLogin)
.post("/login",TrycatchMiddleware, loggedInAdmin, adminController.AdminLogin)

//.post("/dashboard", isAdmin, adminController.    );





module.exports=router