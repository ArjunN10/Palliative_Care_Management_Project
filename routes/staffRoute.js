const router = require('express').Router()
const LaboratoryStaff = require('../controllers/LaboratoryStaffController')
const { isLaboratoryStaff, loggedOutLaboratoryStaff } = require("../middlewares/auth");
const trycatch = require("../middlewares/TryCatch")


router.get("/login", loggedOutLaboratoryStaff,trycatch(LaboratoryStaff.loadLogin))
router.post("/login",loggedOutLaboratoryStaff,trycatch(LaboratoryStaff.staffLogin))

// patients 

router.get("/addPatient", isLaboratoryStaff,trycatch(LaboratoryStaff.getAddPatient));
router.post("/addPatient",isLaboratoryStaff,trycatch(LaboratoryStaff.AddPatient));
router.get("/dashboard", isLaboratoryStaff,trycatch (LaboratoryStaff.getPatientsList));
router.post("/searchPatients" ,isLaboratoryStaff,trycatch(LaboratoryStaff.searchPatient));
router.get ("/dashboard/:id/edit",isLaboratoryStaff,trycatch(LaboratoryStaff.editPatient));
router.post ("/updatePatient",isLaboratoryStaff,trycatch(LaboratoryStaff.updatePatient));
router.delete("/dashboard/:id/destroy",isLaboratoryStaff,trycatch(LaboratoryStaff.deletePatient));



module.exports = router;
