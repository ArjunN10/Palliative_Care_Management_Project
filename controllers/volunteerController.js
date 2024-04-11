const User = require("../models/volunteerModel");
const Patient = require("../models/patientModel");
const Medicine = require("../models/medicineModel");
const MedicineDistribution = require("../models/MdcnDstrbtionModel");
const bcrypt = require("bcrypt");
const Attendance = require('../models/attendanceModel')



const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports={


// register

loadRegister : async (req, res) => {
  try {
    res.render("users/registration", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
},



insertUser : async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.render("users/registration", {
        message: null,
        error: "User already exists.",
      });
    }

    const secPassword = await securePassword(password);
    let is_Lab_Staff = 0;
    let is_volunteer = 0;
    if (role === 'labStaff') {
      is_Lab_Staff = 1;
    } else if (role === 'volunteer') {
      is_volunteer = 1;
    } else if (role === 'doctor') {
      is_doctor = 1;
    }

    const user = new User({
      name,
      email,
      mobile,
      password: secPassword,
      is_Lab_Staff,
      is_volunteer,
      is_doctor
    });

    const userData = await user.save();
    
    if (userData) {
      res.redirect("/login");
    } else {
      res.render("users/registration", {
        error: "Your registration has failed",
        message: null,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
},


// login

loadLogin : async (req, res) => {
  const { error } = req.query;
  try {
    res.render("users/login", { message: null, error: error ? error : null });
  } catch (error) {
    console.log(error.message);
  }
},


validLogin: async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.render("users/login", {
        message: null,
        error: "User not found.",
      });

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch)
      return res.render("users/login", {
        error: "Wrong password.",
        message: null,
      });
    if (user.is_volunteer === 1 && user.is_varified === 1) { 
      req.session.volunteer = user._id;
      return res.redirect("/")
    } else {
      return res.redirect("/users/login?error=" + encodeURIComponent("You are not a verified Doctor"));
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
},

logout : (req, res) => {
  req.session.destroy();
  res.redirect("/login");
},


//dashboard 

loadIndex : async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const patients = await Patient.aggregate([
      {
        $lookup: {
          from: "medicines",
          localField: "Medicines.medicine",
          foreignField: "_id",
          as: "Medicines.medicine",
        },
      },
    ]);
    res.render("users/index", { user, patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},


searchPatient : async (req, res) => {
  const user = await User.findById(req.user);
  const { q } = req.body;
  try {
    let patients;
    if (q) {
      patients = await Patient.aggregate([
        {
          $match: {
            name: { $regex: ".*" + q + ".*" },
          },
        },
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine",
          },
        },
      ]);
    } else {
      patients = await Patient.aggregate([
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine",
          },
        },
      ]);
    }
    res.render("users/index", { user, patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
},


// ===============================< Medicine Management >================================//

getMedicines : async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const medicines = await Medicine.find();
    res.render("users/medicines", {
      user,                                               //med stock
      medicines,
      message: null,
      error: null,
    });
  } catch (error) {
    console.log(error.message);
  }
},

searchMedicine : async (req, res) => {
  const user = await User.findById(req.user);
  const { q } = req.body;
  try {
    let medicines;
    if (q) {
      medicines = await Medicine.find({ name: { $regex: ".*" + q + ".*" } });       // search med
    } else {
      medicines = await Medicine.find();
    }
    res.render("users/medicines", {
      user,
      medicines,
      message: null,
      error: null,
    });
  } catch (error) {
    console.log(error.message);
  }
},

getPatientMedicines : async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user);
  const Pid = await Patient.findById(id);
  try {
    const patient = await Patient.aggregate([
      {
        $match: {
          _id: Pid._id,
        },
      },                                                  
      {
        $lookup: {
          from: "medicines",
          localField: "Medicines.medicine",
          foreignField: "_id",
          as: "Medicines.medicine", 
        },
      },
    ]);
    const patientsMedicines = patient[0].Medicines;
    const recievedMedicines = await MedicineDistribution.find({ patient: id });

    res.render("users/patientMedicine", {
      message: null,
      error: null,
      patient,
      user,
      patientsMedicines,
      error: req.flash("error"),
      success: req.flash("success"),
      recievedMedicines,
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
    const patient = await Patient.findById(patientId);

    if (!patient) {
      req.flash("error", "patient not found");
      res.redirect("/patientMedicines");
    }

    const countNumber = parseInt(count, 10);

    if (isNaN(countNumber)) {
      req.flash("error", "please enter a valid count");
      return res.status(400).json({ error: "Invalid medicine count" });
    }
    if (countNumber > selectedMedicine.stock) {
      req.flash("error", "please enter a count less than stock");
      return res.redirect(`/patientMedicines/${patientId}`);
    }
    if (countNumber < 1) {
      req.flash("error", "Invalid medicine count");
      return res.redirect(`/patientMedicines/${patientId}`);
    }
    const medicineDetails = {
      medicine: medicineId,
      name: selectedMedicine.name,
      count: countNumber,
      recievedDate: Date.now(),
    };

    const Newstock = selectedMedicine.stock - countNumber;

    await Patient.findByIdAndUpdate(patientId, {
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
    res.redirect(`/patientMedicines/${patientId}`);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
},

distributioHistory : async (req, res) => {  
  try {
    const user = await User.findById(req.session.volunteer);
    const medicineDistributions = await MedicineDistribution.find().populate("patient");
    res.render("users/medicineHistory", { medicineDistributions, user });
  } catch (error) {
    console.log(error.message);
  }
},






printList : async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  const recievedMedicines = await MedicineDistribution.find({ patient: id });
  res.render("users/printList", { recievedMedicines, patient });  
},


// attentence


getAttendence : async (req,res) => {
  res.render("users/attendanceForm")
},



MarkAttendence : async (req,res) => {
  const { status , role } = req.body
  
  
  const sdate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dates = sdate.toLocaleDateString('en-US', options);
  const userId =  req.session.volunteer 

  const existingAttendance = await Attendance.findOne({
    userId,
    date : dates
});
console.log(existingAttendance)
  if (existingAttendance) {
    return res.status(400).json({ error: "Attendance already marked for today" });
  }
  
  const attendence = new Attendance ({userId,status,date:dates,role})
  await attendence.save()
  res.redirect("/")
},


renderAttendenceDisplay : async (req, res) => {

  const userId = req.session.volunteer;
  const attendanceThisMonth = await User.findById(userId).populate({path :"attendanceHistory"})

      function getAttendenceByMonth(attendanceHistory){
        const Monthattendence = {}

        attendanceHistory.forEach(element => {
          //exteact the elements 
          const date = new Date(element.date)
          const year = date.getFullYear()
          const month = date.getMonth()
          const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
          const monthName = monthNames[month];

          const key = `${year}-${monthName}`;
            if (!Monthattendence[key]) {
          Monthattendence[key] = [];
          }


        // Add the record to the corresponding month
        Monthattendence[key].push(element);
          
        });
        return Monthattendence;

      }

      const MOnthByAttendance = getAttendenceByMonth(attendanceThisMonth.attendanceHistory)
       
      function getAttendanceByYear (attendanceHistory){
       const yearAttendance = {} 
       
       attendanceHistory.forEach(element =>{
          const date = new Date(element.date) ;
          const year = date.getFullYear()
       
        if (!yearAttendance[year]){
          yearAttendance[year] = []
        }

        yearAttendance[year].push(element);

      })

      return yearAttendance
   }

      const YearlyAttendance = getAttendanceByYear(attendanceThisMonth.attendanceHistory)
       res.render('users/attendanceDisplay',{MOnthByAttendance,YearlyAttendance})
    },

    staffsLogin : async (req,res) => {
      res.render("users/staffslog")
    },



};











