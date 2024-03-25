const router = require("express").Router()

const adminController=require("../controllers/adminController")
const medicineController=require("../controllers/medicineController")
const TrycatchMiddleware=require("../middlewares/TryCatch")

const {isAdmin,loggedInAdmin}=require("../middlewares/auth")



router

// ===============================< Login/Logout >================================//

.get("/login", loggedInAdmin,TrycatchMiddleware(adminController.loadLogin))
.post("/login", loggedInAdmin, TrycatchMiddleware(adminController.AdminLogin))

.post("/logout", isAdmin, TrycatchMiddleware( adminController.logoutAdmin))


// ===============================< Volunteer Management >================================//

.get("/dashboard",isAdmin,TrycatchMiddleware(adminController.AdminDashboard))

.post("/createVolunteers",isAdmin,TrycatchMiddleware(adminController.createVolunteer))
.get("/createVolunteersform", isAdmin,TrycatchMiddleware(adminController.AdminAddedVolunteer))

.get("/volunteers/:id/edit",isAdmin,TrycatchMiddleware(adminController.loadEditVolunteer))
.put("/volunteers/:id",isAdmin,TrycatchMiddleware( adminController.updateVolunteer))
.delete("/volunteers/:id/destroy",isAdmin,TrycatchMiddleware(adminController.deleteVolunteer))

// ===============================< Doctor Management >================================//

.get("/doctors", isAdmin,TrycatchMiddleware(adminController.ViewDoctor))

.post("/createDoctor", isAdmin, TrycatchMiddleware(adminController.createDoctor))
.get("/createDoctorForm", isAdmin, TrycatchMiddleware(adminController.AdminAddedDoctor))

.get("/doctors/:id/edit", isAdmin,TrycatchMiddleware(adminController.loadEditDoctor))
.put("/doctors/:id", isAdmin,TrycatchMiddleware( adminController.updateDoctor))
.delete("/doctors/:id/destroy", isAdmin, TrycatchMiddleware(adminController.deleteDoctor))

// ===============================< Patient Management >================================//
    
.get("/patients", isAdmin, TrycatchMiddleware(adminController.ViewPatientsList))
.post("/searchPatients", isAdmin,TrycatchMiddleware(adminController.searchPatient))

// ===============================< Staff Management >================================//

.get("/staffs", isAdmin,TrycatchMiddleware(adminController.ViewLabStaff))

.post("/createStaff", isAdmin,TrycatchMiddleware(adminController.createStaff))
.get("/createStaff", isAdmin,TrycatchMiddleware(adminController.AdminAddedStaff))
.post("/searchStaff", isAdmin,TrycatchMiddleware(adminController.searchStaff))

.get("/staffs/:id/edit", isAdmin,TrycatchMiddleware(adminController.loadEditStaff))
.put("/staffs/:id", isAdmin,TrycatchMiddleware( adminController.updateStaff))
.delete("/staffs/:id/destroy", isAdmin, TrycatchMiddleware(adminController.deleteStaff))

// ===============================< Medicine Management >================================//

.get('/medicines',isAdmin,TrycatchMiddleware(adminController.getMedicines))
.post("/distribute-medicines/:patientId", isAdmin,TrycatchMiddleware(adminController.distributeMedicines))
.get("/distributionHistory",isAdmin,TrycatchMiddleware(adminController.distributioHistory))

// ===============================< Attendance Management >================================//

// doctor 

.get('/attendance/doctors',isAdmin,TrycatchMiddleware(adminController.DoctorsList))
.get('/attendance/doctors/:doctorId', isAdmin, TrycatchMiddleware(adminController.getDoctorAttendanceHistory))
.get('/attendance/doctors/:doctorId/interval/:interval(week|month|year)', isAdmin, TrycatchMiddleware(adminController.getDoctorAttendanceHistory))
// staff 

.get('/attendance/staffs',isAdmin,TrycatchMiddleware(adminController.StaffList))
.get('/attendance/staffs/:staffId', isAdmin, TrycatchMiddleware(adminController.getStaffAttendanceHistory))
.get('/attendance/staffs/:staffId/interval/:interval(week|month|year)', isAdmin, TrycatchMiddleware(adminController.getStaffAttendanceHistory))
// volunteer 

.get('/attendance/volunteers',isAdmin,TrycatchMiddleware(adminController.VolunteerList))  
.get('/attendance/volunteers/:volunteerId', isAdmin, TrycatchMiddleware(adminController.getVolunteerAttendanceHistory))
.get('/attendance/volunteers/:volunteerId/interval/:interval(week|month|year)', isAdmin, TrycatchMiddleware(adminController.getVolunteerAttendanceHistory))
module.exports=router