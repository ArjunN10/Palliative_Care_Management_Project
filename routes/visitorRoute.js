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

.post("/logout",TrycatchMiddleware( visitorController.Visitorlogout)) 
    // ===============================< Home >======================================//

.get('/',TrycatchMiddleware(visitorController.visitorDashboard))
  
    // ===============================< Appoinment >======================================//
.post('/appointment',isVisitor,TrycatchMiddleware(visitorController.VisitorAppointment))
    
    // ===============================< Feedback >======================================//
.post('/feedback',TrycatchMiddleware(visitorController.feedbackData))

  
module.exports=router





