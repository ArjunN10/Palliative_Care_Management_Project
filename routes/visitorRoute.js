const router=require("express").Router()
const visitorController=require("../controllers/visitorController")
const TrycatchMiddleware=require("../middlewares/TryCatch")
const {isVisitor,loggedOutVisitor,isVisitorVerified}=require("../middlewares/auth")


router

.get("/register",loggedOutVisitor,TrycatchMiddleware(visitorController.loadRegister))
.post("/register",loggedOutVisitor,TrycatchMiddleware(visitorController.VisitorRegister))


.get("/login",loggedOutVisitor,TrycatchMiddleware(visitorController.loadLogin))
.post("/login", loggedOutVisitor,TrycatchMiddleware( visitorController.VisitorLogin)) 


.get('/index',isVisitor,TrycatchMiddleware(visitorController.visitorDashboard))
  

  
module.exports=router





