const router = require("express").Router();
const doctorController = require("../controllers/doctorController");
const medicineController = require("../controllers/medicineController");
const TrycatchMiddleware=require("../middlewares/TryCatch")

const { isDoctorLogged ,isDoctor} = require("../middlewares/auth");


router

    // ===============================<  register  >===================================//


// .get('/register', isDoctorLogged, TrycatchMiddleware(doctorController.loadRegister))        
// .post('/register', isDoctorLogged,TrycatchMiddleware( doctorController.insertDoctor))    

    // ===============================< Login >======================================//  

.get("/login",isDoctorLogged,TrycatchMiddleware(doctorController.loadLogin))
.post("/login", isDoctorLogged,TrycatchMiddleware( doctorController.DoctorLogin)) 

    // ===============================< volunteers >================================//

.get("/dashboard", isDoctor,TrycatchMiddleware(doctorController.dashboard) )
.put("/users/:id", isDoctor,TrycatchMiddleware( doctorController.updateUser))
.get("/users/:id/edit", isDoctor,TrycatchMiddleware(doctorController.loadEditUser) )
.delete("/users/:id/destroy", isDoctor,TrycatchMiddleware(doctorController.deleteUser))

.post("/createUser", isDoctor,TrycatchMiddleware(doctorController.createUser) )
.get("/createUser", isDoctor,TrycatchMiddleware(doctorController.DoctorAddUser) )

    // ===============================< patients >================================//

.post("/addPatient", isDoctor, TrycatchMiddleware(doctorController.AddPatient))
.get("/addPatient", isDoctor, TrycatchMiddleware(doctorController.getAddPatient))
.get("/patients", isDoctor,TrycatchMiddleware(doctorController.getPatientsList))
.post("/searchPatients", isDoctor,TrycatchMiddleware(doctorController.searchPatient) )
.get("/patients/:id/edit", isDoctor,TrycatchMiddleware(doctorController.editPatient) )
.post("/updatePatient", isDoctor,TrycatchMiddleware(doctorController.updatePatient))
.delete("/patients/:id/destroy", isDoctor, TrycatchMiddleware(doctorController.deletePatient))

    // ===============================< medicine >================================//

.get("/medicines", isDoctor, TrycatchMiddleware(medicineController.showMedicines))
.get("/addMedicine", isDoctor,TrycatchMiddleware(medicineController.ShowAddMedicine) )
.post("/createMedicine", isDoctor,TrycatchMiddleware(medicineController.addMedicine))
.get("/medicines/:id/edit", isDoctor,TrycatchMiddleware( medicineController.showEditMed))
.post("/editMedicine", isDoctor,TrycatchMiddleware(medicineController.updateMedicine) )
.delete("/medicines/:id/destroy",isDoctor,TrycatchMiddleware(medicineController.deleteMedicine))
.post("/medicines/search", isDoctor,TrycatchMiddleware(medicineController.searchMedicine))


.get("/medicineHistory", isDoctor, TrycatchMiddleware(doctorController.medicineHistory))
.post("/logout", isDoctor,TrycatchMiddleware( doctorController.logoutDoctor))

    // ===============================< staff management>=========================//

.get("/staffs", isDoctor,TrycatchMiddleware(doctorController.ViewLabStaff))

.post("/createStaff", isDoctor,TrycatchMiddleware(doctorController.createStaff)) 
.get("/createStaff", isDoctor,TrycatchMiddleware(doctorController.DoctorAddedStaff))
.post("/searchStaff", isDoctor,TrycatchMiddleware(doctorController.searchStaff))


router.get("/markAttendence",isDoctor,TrycatchMiddleware(doctorController.getAttendence))
router.post ("/markAttendence",isDoctor,TrycatchMiddleware(doctorController.MarkAttendence))
router.get("/attendanceDisplay",isDoctor,TrycatchMiddleware(doctorController.renderAttendenceDisplay))



module.exports = router;
