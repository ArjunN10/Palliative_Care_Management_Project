const User = require("../models/userModel");
const Manager=require("../models/managerModel")
const Patients=require("../models/patientModel")
const Medicine = require("../models/medicineModel");
const bcrypt = require("bcrypt");
const MedicineDistribution =require('../models/MdcnDstrbtionModel')
const Attendance = require('../models/attendanceModel')
const visitors=require("../models/visitorModel")
const Appointments=require("../models/appointmentModel")
const Feedback=require("../models/feedbackModel")
const {getAttendanceForTimeInterval}=require("../config/attendanceUtils")




const securePassword =async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};



module.exports={


loadLogin:(req, res) => {
    res.render("manager/login", { error: null, message: null });  
  },
  
  
  ManagerLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Manager.findOne({ email });
      if (!user)
        return res.render("manager/login", {
          message: null,
          error: "User not found.",
        });
  
      const isMatch = await bcrypt.compare(password, user.password); 
      if (!isMatch)
        return res.render("manager/login", {
          error: "Wrong password.",
          message: null,
        });
      if (user.is_manager === 1 ) { 
        req.session.manager = user._id;
        return res.redirect("/manager/dashboard")
      } else {
        return res.redirect("/manager/login?error=" + encodeURIComponent("You are not a verified manager"));
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Internal Server Error");
    }
  },


      // ===============================< Logout >================================//
    
      logoutManager:(req, res) => {
        req.session.destroy();
        res.redirect("/manager/login");
      },



       // ===============================< Volunteer Management >================================//
    
       ManagerDashboard : async (req, res) => {
        const { q } = req.query;
        try {
          let users;
          if (q && q.length > 0) {
            users = await User.find({
              name: { $regex: ".*" + q + ".*" },
              is_volunteer:1,
              is_verified: { $in:[0, 1] }
            });
          } else {
            users = await User.find({
              is_volunteer:1,
              is_varified: { $in:[0, 1] }
            });
          }
          res.render("manager/dashboard", { users, q });
        } catch (error) {
          console.log(error.message);
          res.status(500).send("Internal Server Error");
        }
      },


ManagerAddedVolunteer : async (req, res) => {
try {
  res.render("manager/createVolunteers", { error: null, message: null });
} catch (error) {
  console.log(error.message);
}
},


createVolunteer : async (req, res) => {
const { name, email, password, mobile,  } = req.body;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
try {
if (!email)
  return res.render("manager/createVolunteers", { error: "Email is required" });
if (!emailRegex.test(email))
  return res.render("manager/user_new", {
    error: "Email must be a valid email!",
  });
  if(password<6){
    return res.render("manager/createVolunteers", {
      message: null,
      error: "password must be atleast 6 letters",
    });
  }
const isExists = await User.findOne({ email });
if (isExists)
  return res.render("manager/createVolunteers", {
    error: "User already exists",
    message: null,
  });
  const secPassword = await securePassword(req.body.password);
const user = new User({
  name,
  email,
  mobile,
  password:secPassword,
  is_volunteer:1,
  is_varified:1,
});
await user.save();
return res.redirect("/manager/dashboard");
} catch (error) {
console.log(error.message);
}
},

  loadEditVolunteer : async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      res.render("manager/editVolunteers", { user });
    } catch (error) {
      console.log(error);
    }
  },


  updateVolunteer : async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, is_varified } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            email,
            mobile,
            is_varified,
          },
        },
        { new: true }
      );
      res.redirect("/manager/dashboard");
    } catch (error) {
      console.log(error);
    }
  },

  // deleteVolunteer: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const user = await User.findOneAndDelete({ _id: id });
  //     if (req.session.user_session === user._id) {
  //       req.session.destroy();
  //     }
  //     return res.redirect("/manager/dashboard");
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // },


  volunteertoggleVerification : async (req, res) => {
    const userId = req.params.id;
    const { is_verified } = req.body;
  
    try {
      const volunteer = await User.findById(userId);
      if (!volunteer) {
        return res.status(404).json({ message: 'Volunteer not found' });
      }
  
      volunteer.is_varified = is_verified === '0' ? false : true;
      await volunteer.save();
  
      res.redirect('/manager/dashboard'); 
    } catch (error) {
      console.error('Error toggling verification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  
// ===============================< Doctor Management >================================//



ViewDoctor: async (req, res) => {
  const { q } = req.query;
  try {
    let users;
    if (q && q.length > 0) {
      users = await User.find({
        name: { $regex: ".*" + q + ".*" },
        is_doctor:1,
        is_verified: { $in:[0, 1] }
      });
    } else {
      users = await User.find({
        is_doctor:1,
        is_varified: { $in:['0', '1'] }
      });
    }
    res.render("manager/doctors", { users, q });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},



loadEditDoctor : async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render("manager/editDoctor", { user });
  } catch (error) {
    console.log(error);
  }
},


 updateDoctor : async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, is_varified } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          mobile,
          is_varified,
        },
      },
      { new: true }
    );
    res.redirect("/manager/doctors");
  } catch (error) {
    console.log(error);
  }
},

ManagerAddedDoctor : async (req, res) => {
  try {
    res.render("manager/createDoctor", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
},


createDoctor : async (req, res) => {
  const { name, email, password, mobile,  } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  try {
    if (!email)
      return res.render("manager/createDoctor", { error: "Email is required" });
    if (!emailRegex.test(email))
      return res.render("manager/user_new", {
        error: "Email must be a valid email!",
      });
      if(password<6){
        return res.render("manager/createDoctor", {
          message: null,
          error: "password must be atleast 6 letters",
        });
      }
    const isExists = await User.findOne({ email });
    if (isExists)
      return res.render("manager/createDoctor", {
        error: "User already exists",
        message: null,
      });
      const secPassword = await securePassword(req.body.password);
    const user = new User({
      name,
      email,
      mobile,
      password:secPassword,
      is_doctor:1,
      is_varified:1,
    });
    await user.save();
    return res.redirect("/manager/doctors");
  } catch (error) {
    console.log(error.message);
  }
},

//  deleteDoctor : async (req, res) => {
//   const { id } = req.params
//   try {
//     const user = await User.findOneAndDelete({ _id: id });
//     if (req.session.doctor_session === user._id) {
//       req.session.destroy();
//     }
//     return res.redirect("/manager/doctors");
//   } catch (error) {
//     console.log(error.message);
//   }
// },


doctortoggleVerification : async (req, res) => {
  const userId = req.params.id;
  const { is_verified } = req.body;

  try {
    const doctor = await User.findById(userId);
    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }

    doctor.is_varified = is_verified === '0' ? false : true;
    await doctor.save();

    res.redirect('/manager/doctors'); 
  } catch (error) {
    console.error('Error toggling verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},



// ===============================< L-Staff Management >================================//



ViewLabStaff: async (req, res) => {
  const { q } = req.query;
  try {
    let users;
    if (q && q.length > 0) {
      users = await User.find({
        name: { $regex: ".*" + q + ".*" },
        is_Lab_Staff: 1,
        is_varified: { $in: [0, 1] },
      });
    } else {
      users = await User.find({
        is_Lab_Staff: 1,
        is_varified: { $in: [0, 1] },
      });
    }
    res.render("manager/staffs", { users, q });
  } catch (error) {
    console.log(error.message);
  }
},

loadEditStaff : async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render("manager/editStaff", { user });
  } catch (error) {
    console.log(error);
  }
},


 updateStaff : async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, is_varified } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          mobile,
          is_varified,
        },
      },
      { new: true }
    );
    res.redirect("/manager/staffs");
  } catch (error) {
    console.log(error);
  }
},



ManagerAddedStaff : async (req, res) => {
  try {
    res.render("manager/createStaff", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
},



 createStaff : async (req, res) => {
  const { name, email, password, mobile,  } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  try {
    if (!email)
      return res.render("manager/createStaff", { error: "Email is required" });
    if (!emailRegex.test(email))
      return res.render("manager/user_new", {
        error: "Email must be a valid email!",
      });
      if(password<6){
        return res.render("manager/createStaff", {
          message: null,
          error: "password must be atleast 6 letters",
        });
      }
    const isExists = await User.findOne({ email });
    if (isExists)
      return res.render("manager/createStaff", {
        error: "User already exists",
        message: null,
      });
      const secPassword = await securePassword(req.body.password);
    const user = new User({
      name,
      email,
      mobile,
      password:secPassword,
      is_Lab_Staff:1,
      is_varified:1,
    });
    await user.save();
    return res.redirect("/manager/staffs");
  } catch (error) {
    console.log(error.message);
  }
},


searchStaff : async (req, res) => {
  const { q } = req.body;
  try {
    let users;

    if (q) {
      users = await User.aggregate([
        {
          $match: {
            name: { $regex: ".*" + q + ".*" }
          }
        },
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine"
          }
        }
      ]);
    } else {
      users = await User.aggregate([
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine"
          }
        }
      ]);
    }

    res.render("manager/staffs", { users, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
},


stafftoggleVerification : async (req, res) => {
  const userId = req.params.id;
  const { is_verified } = req.body;

  try {
    const staff = await User.findById(userId);
    if (!staff) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    staff.is_varified = is_verified === '0' ? false : true;
    await staff.save();

    res.redirect('/manager/staffs'); 
  } catch (error) {
    console.error('Error toggling verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},


// ===============================< Patient Management >================================//


ViewPatientsList: async (req, res) => {
  try {
    const patients = await Patients.aggregate([
      {
        $lookup: {
          from: "medicines",
          localField: "Medicines.medicine",
          foreignField: "_id",
          as: "Medicines.medicine",
        },
      },
    ]);

    res.render("manager/patients", {
      patients,
      error: null,
      message: null,
    });
  } catch (error) {
    console.log(error.message);
  }
},


searchPatient : async (req, res) => {
  const { q } = req.body;
  try {
    let patients;

    if (q) {
      patients = await Patients.aggregate([
        {
          $match: {
            name: { $regex: ".*" + q + ".*" }
          }
        },
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine"
          }
        }
      ]);
    } else {
      patients = await Patients.aggregate([
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine"
          }
        }
      ]);
    }

    res.render("manager/patients", { patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
},


// ===============================<Visitor Management >================================//


ViewVisitors: async (req, res) => {
  const { q } = req.query;
  try {
    let users;
    if (q && q.length > 0) {
      users = await visitors.find({
        name: { $regex: ".*" + q + ".*" },
        is_visitor:1
      });
    } else {
      users = await visitors.find({
        is_visitor:1
      });
    }
    res.render("manager/visitors", { users, q });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},


getVisitorFeedback:async (req, res) => {
  try {
      const visitorId = req.params.id;

      const visitor = await visitors.findById(visitorId);
   

      if (!visitor) {
          return res.status(404).json({ message: 'Visitor not found' });     
      }   

      const latestFeedback = await Feedback.findOne({ userId: visitorId })  
          .sort({ createdAt: -1 }) 
          .populate('userId', 'name'); 

      res.render("manager/feedbackDisplay",{ userFeedback:latestFeedback,user:visitor });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
},


// ===============================< medicine Management >================================//


getMedicines : async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.render("manager/medicines", {
      medicines,
      message: null,
      error: null,
    });
  } catch (error) {
    console.log(error.message);
  }
},


distributeMedicines : async (req, res) => {
  const staff = await User.findById(req.session.user);
  const { patientId } = req.params;
  const { medicineId, count } = req.body;
  try {
    const selectedMedicine = await Medicine.findById(medicineId);
    const patient = await Patients.findById(patientId);

    if (!patient) {
      req.flash("error", "patient not found");
      res.redirect("/manager/patientMedicines");
    }

    const countNumber = parseInt(count, 10);

    if (isNaN(countNumber)) {
      req.flash("error", "please enter a valid count");
      return res.status(400).json({ error: "Invalid medicine count" });
    }
    if (countNumber > selectedMedicine.stock) {
      req.flash("error", "please enter a count less than stock");
      return res.redirect(`/manager/patientMedicines/${patientId}`);
    }
    if (countNumber < 1) {
      req.flash("error", "Invalid medicine count");
      return res.redirect(`/manager/patientMedicines/${patientId}`);
    }
    const medicineDetails = {
      medicine: medicineId,
      name: selectedMedicine.name,
      count: countNumber,
      recievedDate: Date.now(),
    };

    const Newstock = selectedMedicine.stock - countNumber;

    await Patients.findByIdAndUpdate(patientId, {
      $push: { MedicinesReceived: medicineDetails },
    });
    await Medicine.findByIdAndUpdate(medicineId, {
      $set: { stock: Newstock },
    });
    await MedicineDistribution.create({
      Slno: selectedMedicine.Slno,
      medicine: medicineId,
      medicineName: selectedMedicine.name,
      count: countNumber,
      distributedDate: Date.now(),
      staffName: staff.name, 
      patient: patientId,
      patientName:patient.name,
      patientRgNo:patient.RegNo
    });
    const mds = await MedicineDistribution.find();
    req.flash(
      "success",
      `${selectedMedicine.name} is disitributed successfully`
    );
    res.redirect(`/manager/patientMedicines/${patientId}`);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
},


distributioHistory : async (req, res) => {
  try {
    const medicineDistributions = await MedicineDistribution.find().populate("patient")
  
    res.render("manager/medicineHistory", { medicineDistributions });
  } catch (error) {
    console.log(error.message);
  }
},


// ===============================<Appointment>================================//


displayLatestAppointments :async (req, res) => {
  try {
      const page = req.query.page || 1; 
      const limit = 4; 

      // Calculating the skip value based on the page number and limit
      const skip = (page - 1) * limit;

      const appointments = await Appointments.find()
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit);

      const totalAppointments = await Appointments.countDocuments();

      const totalPages = Math.ceil(totalAppointments / limit);

      res.render('manager/latestAppointments', {
          appointments: appointments,
          totalAppointments:totalAppointments,
          currentPage: parseInt(page),
          totalPages: totalPages
      });
  } catch (error) {
      console.error('Error fetching latest appointments:', error);
      res.status(500).send('An error occurred while fetching latest appointments');
  }
},


updateAppointmentApproval: async (req, res) => {
  const appointmentId = req.params.id;
  try {
      const appointment = await Appointments.findById(appointmentId);
      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      appointment.is_Approved = appointment.is_Approved === 1 ? 0 : 1;

      await appointment.save();

      res.status(200).json({ message: 'Appointment approval status updated successfully' });
  } catch (error) {
      console.error('Error updating appointment approval status:', error);
      res.status(500).json({ message: 'An error occurred while updating appointment approval status' });
  }
},


// ===============================< Attendance Management >================================//


DoctorsList: async (req, res) => {
  const { q } = req.query;
  try {
    let users;
    if (q && q.length > 0) {
      users = await User.find({
        name: { $regex: ".*" + q + ".*" },
        is_doctor:1,
        is_verified: { $in:[0, 1] }
      });
    } else {
      users = await User.find({
        is_doctor:1,
        is_varified: { $in:['0', '1'] }
      });
    }
    res.render("manager/doctorAttendance", { users, q });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},


getDoctorAttendanceHistory: async (req, res) => {
  const { doctorId } = req.params;
  const { interval } = req.query;

  try {
    const doctor = await User.findById(doctorId).populate('attendanceHistory');
    if (!doctor || !doctor.is_doctor) {
      return res.status(404).send("Doctor not found");
    }

    const totalRecords = doctor.attendanceHistory.length;
    const presentCount = doctor.attendanceHistory.filter(record => record.status === 'Present').length;
    const percentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    let currentAttendance = [];
    if (interval === 'week') {
      currentAttendance = getAttendanceForTimeInterval(doctor.attendanceHistory, 'week');
    } else if (interval === 'month') {
      currentAttendance = getAttendanceForTimeInterval(doctor.attendanceHistory, 'month');
    } else if (interval === 'year') {
      currentAttendance = getAttendanceForTimeInterval(doctor.attendanceHistory, 'year');
    } else {
      currentAttendance = getAttendanceForTimeInterval(doctor.attendanceHistory, 'month');
    }

    res.render('manager/attendanceHistory', { 
      doctor: doctor, 
      percentage: percentage,
      currentAttendance: currentAttendance,
      interval: interval
    });
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).send("Internal Server Error");
  }},




  
StaffList: async (req, res) => {
  const { q } = req.query;
  try {
    let users;
    if (q && q.length > 0) {
      users = await User.find({
        name: { $regex: ".*" + q + ".*" },
        is_Lab_Staff:1,
        is_verified: { $in:[0, 1] }
      });
    } else {
      users = await User.find({
        is_Lab_Staff:1,
        is_varified: { $in:['0', '1'] }
      });
    }
    res.render("manager/staffAttendance", { users, q });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},



getStaffAttendanceHistory: async (req, res) => {
  const { staffId } = req.params;
  const { interval } = req.query;

  try {
    const staff = await User.findById(staffId).populate('attendanceHistory');
    if (!staff || !staff.is_Lab_Staff) {
      return res.status(404).send("Doctor not found");
    }

    const totalRecords = staff.attendanceHistory.length;
    const presentCount = staff.attendanceHistory.filter(record => record.status === 'Present').length;
    const percentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    let currentAttendance = [];
    if (interval === 'week') {
      currentAttendance = getAttendanceForTimeInterval(staff.attendanceHistory, 'week');
    } else if (interval === 'month') {
      currentAttendance = getAttendanceForTimeInterval(staff.attendanceHistory, 'month');
    } else if (interval === 'year') {
      currentAttendance = getAttendanceForTimeInterval(staff.attendanceHistory, 'year');
    } else {
      currentAttendance = getAttendanceForTimeInterval(staff.attendanceHistory, 'month');
    }

    res.render('manager/staffAttendanceHistory', { 
      staff: staff, 
      percentage: percentage,
      currentAttendance: currentAttendance,
      interval: interval
    });
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).send("Internal Server Error");
  }},




VolunteerList: async (req, res) => {
  const { q } = req.query;
  try {
    let users;
    if (q && q.length > 0) {
      users = await User.find({
        name: { $regex: ".*" + q + ".*" },
        is_volunteer:1,
        is_verified: { $in:[0, 1] }
      });
    } else {
      users = await User.find({
        is_volunteer:1,
        is_varified: { $in:['0', '1'] }
      });
    }
    res.render("manager/volunteerAttendance", { users, q });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},


getVolunteerAttendanceHistory: async (req, res) => {
  const { volunteerId } = req.params;
  const { interval } = req.query;

  try {
    const volunteer = await User.findById(volunteerId).populate('attendanceHistory');
    if (!volunteer || !volunteer.is_volunteer) {
      return res.status(404).send("Volunteer not found");
    }

    const totalRecords = volunteer.attendanceHistory.length;
    const presentCount = volunteer.attendanceHistory.filter(record => record.status === 'Present').length;
    const percentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    let currentAttendance = [];
    if (interval === 'week') {
      currentAttendance = getAttendanceForTimeInterval(volunteer.attendanceHistory, 'week');
    } else if (interval === 'month') {
      currentAttendance = getAttendanceForTimeInterval(volunteer.attendanceHistory, 'month');
    } else if (interval === 'year') {
      currentAttendance = getAttendanceForTimeInterval(volunteer.attendanceHistory, 'year');
    } else {
      currentAttendance = getAttendanceForTimeInterval(volunteer.attendanceHistory, 'month');
    }

    res.render('manager/volunteerAttendanceHistory', { 
      volunteer: volunteer, 
      percentage: percentage,
      currentAttendance: currentAttendance,
      interval: interval
    });
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).send("Internal Server Error");
  }},



}






