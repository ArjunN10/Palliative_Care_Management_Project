
const user_route = require('express').Router()
const userController = require('../controllers/volunteerController');
const { isLogout, isLogged, isVolunteerVerified } = require('../middlewares/auth')
const TrycatchMiddleware=require("../middlewares/TryCatch")


user_route


    // ===============================< Register >================================//
  
.get('/register',isLogout,TrycatchMiddleware( userController.loadRegister))
.post('/register',isLogout,TrycatchMiddleware( userController.insertUser))

    // ===============================< Login >================================//


.get('/login',isLogout,TrycatchMiddleware( userController.loadLogin))
.post('/login',isLogout,TrycatchMiddleware( userController.validLogin))

    // ===============================< Logout >================================//

.post('/logout',isLogged ,isVolunteerVerified,TrycatchMiddleware( userController.logout))

    // ===============================< Dashboard >================================//

.get('/',isLogged,isVolunteerVerified,TrycatchMiddleware(  userController.loadIndex))

    // ===============================< Patient Med >================================//

.post('/searchPatient',isLogged ,isVolunteerVerified,TrycatchMiddleware(userController.searchPatient))
.get('/patientMedicines/:id',isLogged ,isVolunteerVerified,TrycatchMiddleware(userController.getPatientMedicines))

    // ===============================< medicine >================================//

.get('/medicines',isLogged,isVolunteerVerified,TrycatchMiddleware(userController.getMedicines))
.post('/searchMedicine',isLogged,isVolunteerVerified,TrycatchMiddleware(userController.searchMedicine))

.get('/patientMedicines/:id',isLogged,isVolunteerVerified,TrycatchMiddleware(userController.getPatientMedicines))
.post("/distribute-medicines/:patientId",isLogged,isVolunteerVerified,TrycatchMiddleware(userController.distributeMedicines))
.get("/distributionHistory",isLogged,isVolunteerVerified,TrycatchMiddleware( userController.distributioHistory))
.get('/printList/:id',isLogged,isVolunteerVerified,TrycatchMiddleware(userController.printList)) 



    // ===============================< Attendance >================================//

.get("/markAttendence",isLogged,isVolunteerVerified,TrycatchMiddleware(userController.getAttendence)) 
.post ("/markAttendence",isLogged,isVolunteerVerified,TrycatchMiddleware(userController.MarkAttendence))
.get("/attendanceDisplay",isLogged,isVolunteerVerified,TrycatchMiddleware(userController.renderAttendenceDisplay))

module.exports = user_route;

