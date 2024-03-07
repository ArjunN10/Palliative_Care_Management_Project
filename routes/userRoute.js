const user_route = require('express').Router()
const userController = require('../controllers/userController');
const { isLogout, isLogged, isStaffVerified } = require('../middlewares/auth')


user_route.get('/register', isLogout, userController.loadRegister);
user_route.post('/register', isLogout, userController.insertUser);

user_route.get('/login', isLogout, userController.loadLogin)
user_route.post('/login', isLogout, userController.validLogin)

user_route.get('/', isLogged, isStaffVerified,  userController.loadIndex)
user_route.post('/logout', isLogged, userController.logout)

user_route.post('/searchPatient',isLogged,isStaffVerified,userController.searchPatient)

user_route.get('/medicines',isLogged,isStaffVerified,userController.getMedicines)
user_route.post('/searchMedicine',isLogged,isStaffVerified,userController.searchMedicine)

user_route.get('/patientMedicines/:id',isLogged,isStaffVerified,userController.getPatientMedicines)
user_route.post("/distribute-medicines/:patientId", isLogged,isStaffVerified,userController.distributeMedicines);
user_route.get("/distributionHistory",isLogged,isStaffVerified, userController.distributioHistory);
user_route.get('/printList/:id',isLogged,isStaffVerified,userController.printList)



module.exports = user_route;

