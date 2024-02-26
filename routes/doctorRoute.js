const router = require("express").Router();
const doctorController = require("../controllers/doctorController");
const medicineController = require("../controllers/medicineController");
const { isDoctor, loggedOutDoctor } = require("../middlewares/auth");

router.get("/login", loggedOutDoctor, doctorController.loadLogin);
router.post("/login", loggedOutDoctor, doctorController.DoctorLogin);

router.get("/dashboard", isDoctor, doctorController.dashboard);

router.get("/users/:id/edit", isDoctor, doctorController.loadEditUser);
router.put("/users/:id", isDoctor, doctorController.updateUser);
router.delete("/users/:id/destroy", isDoctor, doctorController.deleteUser);

router.get("/createUser", isDoctor, doctorController.DoctorAddUser);
router.post("/createUser", isDoctor, doctorController.createUser);

//patients
router.get("/addPatient", isDoctor, doctorController.getAddPatient);
router.post("/addPatient", isDoctor, doctorController.AddPatient);
router.get("/patients", isDoctor, doctorController.getPatientsList);
router.post("/searchPatients", isDoctor, doctorController.searchPatient);
router.get("/patients/:id/edit", isDoctor, doctorController.editPatient);
router.post("/updatePatient", isDoctor, doctorController.updatePatient);
router.delete("/patients/:id/destroy", isDoctor, doctorController.deletePatient);

//medicine
router.get("/medicines", isDoctor, medicineController.showMedicines);
router.get("/addMedicine", isDoctor, medicineController.ShowAddMedicine);
router.post("/createMedicine", isDoctor, medicineController.addMedicine);
router.get("/medicines/:id/edit", isDoctor, medicineController.showEditMed);
router.post("/editMedicine", isDoctor, medicineController.updateMedicine);
router.delete("/medicines/:id/destroy",isDoctor,medicineController.deleteMedicine);
router.post("/medicines/search", isDoctor, medicineController.searchMedicine);


router.get("/medicineHistory", isDoctor, doctorController.medicineHistory);
router.post("/logout", isDoctor, doctorController.logoutDoctor);

module.exports = router;
