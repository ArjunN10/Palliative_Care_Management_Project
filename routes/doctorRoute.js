const router = require("express").Router();
const doctorController = require("../controllers/doctorController");
const medicineController = require("../controllers/medicineController");
const TrycatchMiddleware=require("../middlewares/TryCatch")

const { isDoctor, loggedOutDoctor } = require("../middlewares/auth");

router
.get("/login",loggedOutDoctor,TrycatchMiddleware(doctorController.loadLogin) )

.post("/login", loggedOutDoctor,TrycatchMiddleware( doctorController.DoctorLogin))

.get("/dashboard", isDoctor,TrycatchMiddleware(doctorController.dashboard) )
.put("/users/:id", isDoctor,TrycatchMiddleware( doctorController.updateUser))
.get("/users/:id/edit", isDoctor,TrycatchMiddleware(doctorController.loadEditUser) )
.delete("/users/:id/destroy", isDoctor, TrycatchMiddleware(doctorController.deleteUser))

.post("/createUser", isDoctor,TrycatchMiddleware(doctorController.createUser) )
.get("/createUser", isDoctor,TrycatchMiddleware(doctorController.DoctorAddUser) )

//patients

.post("/addPatient", isDoctor, TrycatchMiddleware(doctorController.AddPatient))
.get("/addPatient", isDoctor, TrycatchMiddleware(doctorController.getAddPatient))
.get("/patients", isDoctor, TrycatchMiddleware(doctorController.getPatientsList))
.post("/searchPatients", isDoctor,TrycatchMiddleware(doctorController.searchPatient) )
.get("/patients/:id/edit", isDoctor,TrycatchMiddleware(doctorController.editPatient) )
.post("/updatePatient", isDoctor, TrycatchMiddleware(doctorController.updatePatient))
.delete("/patients/:id/destroy", isDoctor, TrycatchMiddleware(doctorController.deletePatient))

//medicine
.get("/medicines", isDoctor, TrycatchMiddleware(medicineController.showMedicines))
.get("/addMedicine", isDoctor,TrycatchMiddleware(medicineController.ShowAddMedicine) )
.post("/createMedicine", isDoctor, TrycatchMiddleware(medicineController.addMedicine))
.get("/medicines/:id/edit", isDoctor,TrycatchMiddleware( medicineController.showEditMed))
.post("/editMedicine", isDoctor,TrycatchMiddleware(medicineController.updateMedicine) )
.delete("/medicines/:id/destroy",isDoctor,TrycatchMiddleware(medicineController.deleteMedicine))
.post("/medicines/search", isDoctor, TrycatchMiddleware(medicineController.searchMedicine))


.get("/medicineHistory", isDoctor,  TrycatchMiddleware(doctorController.medicineHistory))
.post("/logout", isDoctor, TrycatchMiddleware( doctorController.logoutDoctor))

module.exports = router;
