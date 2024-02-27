const router = require("express").Router();

const adminController=require("../controllers/adminController")
const medicineController=require("../controllers/medicineController")
const {isAdmin,loggedOutAdmin}=require("../middlewares/auth")


// router.get("/login", loggedOutAdmin, adminController.loadLogin);


module.exports=router