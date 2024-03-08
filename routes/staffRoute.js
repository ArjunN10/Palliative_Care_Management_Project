const router = require('express').Router()
const LaboratoryStaff = require('../controllers/LaboratoryStaffController')
const { isLaboratoryStaff, loggedOutLaboratoryStaff } = require("../middlewares/auth");


router.get("/login", loggedOutLaboratoryStaff, LaboratoryStaff.loadLogin)
router.post("/login",loggedOutLaboratoryStaff,LaboratoryStaff.staffLogin)

// router.get("/dashboard",isLaboratoryStaff,LaboratoryStaff.dashboard)


router.get("/addPatient", isLaboratoryStaff,LaboratoryStaff.getAddPatient);
router.post("/addPatient",isLaboratoryStaff,LaboratoryStaff.AddPatient)
router.get("/dashboard", isLaboratoryStaff, LaboratoryStaff.getPatientsList);
router.post("/searchPatients" ,isLaboratoryStaff ,LaboratoryStaff.searchPatient) ;





module.exports = router;
