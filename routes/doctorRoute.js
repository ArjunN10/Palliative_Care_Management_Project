const router = require("express").Router();
const doctorController = require("../controllers/doctorController");
const medicineController = require("../controllers/medicineController");
const TrycatchMiddleware=require("../middlewares/TryCatch")

const { isDoctor, loggedOutDoctor } = require("../middlewares/auth");

router
// .use(TrycatchMiddleware)
.get("/login", TrycatchMiddleware,loggedOutDoctor, doctorController.loadLogin)

.post("/login", TrycatchMiddleware,loggedOutDoctor, doctorController.DoctorLogin)

.get("/dashboard", isDoctor, doctorController.dashboard)
.put("/users/:id", isDoctor, doctorController.updateUser)
.get("/users/:id/edit", isDoctor, doctorController.loadEditUser)
.delete("/users/:id/destroy", isDoctor, doctorController.deleteUser)

.post("/createUser", isDoctor, doctorController.createUser)
.get("/createUser", isDoctor, doctorController.DoctorAddUser)

//patients

.post("/addPatient", isDoctor, doctorController.AddPatient)
.get("/addPatient", isDoctor, doctorController.getAddPatient)
.get("/patients", isDoctor, doctorController.getPatientsList)
.post("/searchPatients", isDoctor, doctorController.searchPatient)
.get("/patients/:id/edit", isDoctor, doctorController.editPatient)
.post("/updatePatient", isDoctor, doctorController.updatePatient)
.delete("/patients/:id/destroy", isDoctor, doctorController.deletePatient)

//medicine
.get("/medicines", isDoctor, medicineController.showMedicines)
.get("/addMedicine", isDoctor, medicineController.ShowAddMedicine)
.post("/createMedicine", isDoctor, medicineController.addMedicine)
.get("/medicines/:id/edit", isDoctor, medicineController.showEditMed)
.post("/editMedicine", isDoctor, medicineController.updateMedicine)
.delete("/medicines/:id/destroy",isDoctor,medicineController.deleteMedicine)
.post("/medicines/search", isDoctor, medicineController.searchMedicine)


.get("/medicineHistory", isDoctor, doctorController.medicineHistory)
.post("/logout", isDoctor, doctorController.logoutDoctor)

module.exports = router;
