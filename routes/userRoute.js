const user_route = require('express').Router()
const userController = require('../controllers/userController');
const { isLogout, isLogged, isVolunteerVerified } = require('../middlewares/auth')


user_route

.get('/register', isLogout, userController.loadRegister)
.post('/register', isLogout, userController.insertUser)

//login

.get('/login', isLogout, userController.loadLogin)
.post('/login', isLogout, userController.validLogin)

//logout

.post('/logout', isLogged ,isVolunteerVerified,isVolunteerVerified, userController.logout)


.get('/', isLogged ,isVolunteerVerified,  userController.loadIndex)

.post('/searchPatient',isLogged ,isVolunteerVerified,userController.searchPatient)

// medicine

.get('/medicines',isLogged ,isVolunteerVerified,userController.getMedicines)
.post('/searchMedicine',isLogged ,isVolunteerVerified,userController.searchMedicine)

.get('/patientMedicines/:id',isLogged ,isVolunteerVerified,userController.getPatientMedicines)
.post("/distribute-medicines/:patientId", isLogged ,isVolunteerVerified,userController.distributeMedicines)
.get("/distributionHistory",isLogged ,isVolunteerVerified, userController.distributioHistory)
.get('/printList/:id',isLogged ,isVolunteerVerified,userController.printList)

// attentence

router.get("/markAttendence",isDoctor,TrycatchMiddleware(userController.getAttendence))
router.post ("/markAttendence",isDoctor,TrycatchMiddleware(userController.MarkAttendence))
router.get("/attendanceDisplay/:id",isDoctor,TrycatchMiddleware(userController.renderAttendenceDisplay))

module.exports = user_route;

