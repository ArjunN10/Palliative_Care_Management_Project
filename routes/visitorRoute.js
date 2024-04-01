const router=require("express").Router()
const visitorController=require("../controllers/visitorController")
const TrycatchMiddleware=require("../middlewares/TryCatch")
const {isVisitor,loggedOutVisitor,isVisitorVerified}=require("../middlewares/auth")


router

    // ===============================< Register >======================================//

.get("/register",loggedOutVisitor,TrycatchMiddleware(visitorController.loadRegister))
.post("/register",loggedOutVisitor,TrycatchMiddleware(visitorController.VisitorRegister))   

    // ===============================< Login >======================================//

.get("/login",loggedOutVisitor,TrycatchMiddleware(visitorController.loadLogin))
.post("/login", loggedOutVisitor,TrycatchMiddleware( visitorController.VisitorLogin)) 

    // ===============================< Home >======================================//

.get('/index',isVisitor,TrycatchMiddleware(visitorController.visitorDashboard))
  
    // ===============================< Appoinment >======================================//

  
module.exports=router





