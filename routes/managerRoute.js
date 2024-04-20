const router=require('express').Router()
const ManagerController=require('../controllers/managerController')
const TrycatchMiddleware=require("../middlewares/TryCatch")
const medicineController = require("../controllers/medicineController");
const { loggedOutManager ,isManager} = require("../middlewares/auth");



router

// ===============================< Login >================================//

.get("/login",loggedOutManager,TrycatchMiddleware(ManagerController.loadLogin))
.post("/login", loggedOutManager,TrycatchMiddleware( ManagerController.ManagerLogin)) 

// ===============================< Logout >================================//

.post("/logout", isManager, TrycatchMiddleware( ManagerController.logoutManager))

// ===============================< Volunteer Management >================================//

.get("/dashboard",isManager,TrycatchMiddleware(ManagerController.ManagerDashboard))

.post("/createVolunteers",isManager,TrycatchMiddleware(ManagerController.createVolunteer))
.get("/createVolunteersform", isManager,TrycatchMiddleware(ManagerController.ManagerAddedVolunteer))

.get("/volunteers/:id/edit",isManager,TrycatchMiddleware(ManagerController.loadEditVolunteer))
.put("/volunteers/:id",isManager,TrycatchMiddleware( ManagerController.updateVolunteer))
.post('/volunteers/:id/toggle_verification',isManager,TrycatchMiddleware(ManagerController.volunteertoggleVerification))


// ===============================< Doctor Management >================================//

.get("/doctors", isManager,TrycatchMiddleware(ManagerController.ViewDoctor))

.post("/createDoctor", isManager, TrycatchMiddleware(ManagerController.createDoctor))
.get("/createDoctorForm", isManager, TrycatchMiddleware(ManagerController.ManagerAddedDoctor))

.get("/doctors/:id/edit", isManager,TrycatchMiddleware(ManagerController.loadEditDoctor))
.put("/doctors/:id", isManager,TrycatchMiddleware( ManagerController.updateDoctor))
.post('/doctors/:id/toggle_verification',isManager,TrycatchMiddleware(ManagerController.doctortoggleVerification))


// ===============================< Staff Management >================================//

.get("/staffs", isManager,TrycatchMiddleware(ManagerController.ViewLabStaff))

.post("/createStaff", isManager,TrycatchMiddleware(ManagerController.createStaff))
.get("/createStaff", isManager,TrycatchMiddleware(ManagerController.ManagerAddedStaff))
.post("/searchStaff", isManager,TrycatchMiddleware(ManagerController.searchStaff))

.get("/staffs/:id/edit", isManager,TrycatchMiddleware(ManagerController.loadEditStaff))
.put("/staffs/:id", isManager,TrycatchMiddleware( ManagerController.updateStaff))
.post('/staffs/:id/toggle_verification',isManager,TrycatchMiddleware(ManagerController.stafftoggleVerification))

// ===============================< Patient Management >================================//
    
.get("/patients", isManager, TrycatchMiddleware(ManagerController.ViewPatientsList))
.post("/searchPatients", isManager,TrycatchMiddleware(ManagerController.searchPatient))

// ===============================< Visitor Management >================================//

.get("/visitors", isManager,TrycatchMiddleware(ManagerController.ViewVisitors))
.get('/visitors/:id', isManager, TrycatchMiddleware(ManagerController.getVisitorFeedback)) 

// ===============================< Medicine Management >================================//

.get('/medicines',isManager,TrycatchMiddleware(ManagerController.getMedicines))
.post("/distribute-medicines/:patientId", isManager,TrycatchMiddleware(ManagerController.distributeMedicines))
.get("/distributionHistory",isManager,TrycatchMiddleware(ManagerController.distributioHistory))
.post("/searchPatient", isManager,TrycatchMiddleware(ManagerController.searchPatient))


// ===============================< Appointment >================================//

.get('/latest-appointments',isManager,TrycatchMiddleware( ManagerController.displayLatestAppointments))
.post('/approve-appointment/:id',isManager,TrycatchMiddleware( ManagerController.updateAppointmentApproval))

// ===============================< Attendance Management >================================//

// doctor 

.get('/attendance/doctors',isManager,TrycatchMiddleware(ManagerController.DoctorsList))
.get('/attendance/doctors/:doctorId', isManager, TrycatchMiddleware(ManagerController.getDoctorAttendanceHistory))
.get('/attendance/doctors/:doctorId/interval/:interval(week|month|year)', isManager, TrycatchMiddleware(ManagerController.getDoctorAttendanceHistory))
// staff 

.get('/attendance/staffs',isManager,TrycatchMiddleware(ManagerController.StaffList))
.get('/attendance/staffs/:staffId', isManager, TrycatchMiddleware(ManagerController.getStaffAttendanceHistory))
.get('/attendance/staffs/:staffId/interval/:interval(week|month|year)', isManager, TrycatchMiddleware(ManagerController.getStaffAttendanceHistory))
// volunteer 

.get('/attendance/volunteers',isManager,TrycatchMiddleware(ManagerController.VolunteerList))  
.get('/attendance/volunteers/:volunteerId', isManager, TrycatchMiddleware(ManagerController.getVolunteerAttendanceHistory))
.get('/attendance/volunteers/:volunteerId/interval/:interval(week|month|year)', isManager, TrycatchMiddleware(ManagerController.getVolunteerAttendanceHistory))




module.exports=router








