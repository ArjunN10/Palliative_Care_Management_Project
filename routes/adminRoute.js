const router = require("express").Router()

const adminController=require("../controllers/adminController")
const medicineController=require("../controllers/medicineController")
const TrycatchMiddleware=require("../middlewares/TryCatch")

const {isAdmin,loggedInAdmin}=require("../middlewares/auth")



router

// ===============================< Login/Logout >================================//

.get("/login", loggedInAdmin,TrycatchMiddleware(adminController.loadLogin) )
.post("/login", loggedInAdmin, TrycatchMiddleware(adminController.AdminLogin))

.post("/logout", isAdmin, TrycatchMiddleware( adminController.logoutAdmin))


// ===============================< Dashboard >================================//

.get("/dashboard",isAdmin,TrycatchMiddleware(adminController.AdminDashboard))

// ===============================< Staff Management >================================//

.post("/createVolunteers",isAdmin,TrycatchMiddleware(adminController.createVolunteer) )
.get("/createVolunteers", isAdmin,TrycatchMiddleware(adminController.ViewVolunteer) )

.get("/volunteers/:id/edit",isAdmin,TrycatchMiddleware(adminController.loadEditVolunteer) )
.put("/volunteers/:id",isAdmin,TrycatchMiddleware( adminController.updateVolunteer))
.delete("/volunteers/:id/destroy",isAdmin,TrycatchMiddleware(adminController.deleteVolunteer))

// ===============================< Doctor Management >================================//


// .post("/createDoctor", isAdmin, TrycatchMiddleware(adminController.CreateDoctor))
// .get("/createDoctor", isAdmin, TrycatchMiddleware(adminController.ViewDoctor))

// .get("/doctors", isAdmin, TrycatchMiddleware(adminController.getPatientsList))
// .post("/searchPatients", isAdmin,TrycatchMiddleware(adminController.searchPatient) )

// .get("/doctors/:id/edit", isAdmin,TrycatchMiddleware(adminController.EditDoctor) )
// .post("/updatePatient", isAdmin, TrycatchMiddleware(adminController.updateDoctor))
// .delete("/doctors/:id/destroy", isAdmin, TrycatchMiddleware(adminController.deleteDoctor))


.get("/doctors", isAdmin,TrycatchMiddleware(adminController.ViewDoctor) )

.post("/createDoctor", isAdmin,TrycatchMiddleware(adminController.createDoctor) )
.get("/createDoctor", isAdmin,TrycatchMiddleware(adminController.AdminAddedDoctor) )
.post("/searchDoctor", isAdmin,TrycatchMiddleware(adminController.searchDoctor) )

.get("/doctors/:id/edit", isAdmin,TrycatchMiddleware(adminController.loadEditDoctor) )
.put("/doctors/:id", isAdmin,TrycatchMiddleware( adminController.updateDoctor))
.delete("/doctors/:id/destroy", isAdmin, TrycatchMiddleware(adminController.deleteDoctor))


// ===============================< Patient Management >================================//

.get("/patients", isAdmin, TrycatchMiddleware(adminController.ViewPatientsList))
.post("/searchPatients", isAdmin,TrycatchMiddleware(adminController.searchPatient) )


// ===============================< Staff Management >================================//


.get("/staffs", isAdmin,TrycatchMiddleware(adminController.ViewLabStaff) )

.post("/createStaff", isAdmin,TrycatchMiddleware(adminController.createStaff) )
.get("/createStaff", isAdmin,TrycatchMiddleware(adminController.AdminAddedStaff) )
.post("/searchStaff", isAdmin,TrycatchMiddleware(adminController.searchPatient) )

.get("/staffs/:id/edit", isAdmin,TrycatchMiddleware(adminController.loadEditStaff) )
.put("/staffs/:id", isAdmin,TrycatchMiddleware( adminController.updateStaff))
.delete("/staffs/:id/destroy", isAdmin, TrycatchMiddleware(adminController.deleteStaff))

// ===============================< Medicine Management >================================//

// .get("/medicines", isAdmin, TrycatchMiddleware(adminController.showMedicines))
// .get("/addMedicine", isAdmin,TrycatchMiddleware(adminController.ShowAddMedicine) )
// .post("/createMedicine", isAdmin, TrycatchMiddleware(adminController.addMedicine))
// .get("/medicines/:id/edit", isAdmin,TrycatchMiddleware( adminController.showEditMed))
// .post("/editMedicine", isAdmin,TrycatchMiddleware(adminController.updateMedicine) )
// .delete("/medicines/:id/destroy",isAdmin,TrycatchMiddleware(adminController.deleteMedicine))
// .post("/medicines/search", isAdmin, TrycatchMiddleware(adminController.searchMedicine))


.get('/medicines',isAdmin,TrycatchMiddleware(adminController.getMedicines))
.post('/searchMedicine',isAdmin,TrycatchMiddleware(adminController.searchMedicine))

.get('/patientMedicines/:id',isAdmin,TrycatchMiddleware(adminController.getPatientMedicines))
.post("/distribute-medicines/:patientId", isAdmin,TrycatchMiddleware(adminController.distributeMedicines))
.get("/distributionHistory",isAdmin,TrycatchMiddleware(adminController.distributioHistory))
.get('/printList/:id',isAdmin,TrycatchMiddleware(adminController.printList))

module.exports=router