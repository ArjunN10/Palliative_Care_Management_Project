const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Medicine = require("../models/medicineModel");
const bcrypt = require("bcrypt");
const MedicineDistribution =require('../models/MdcnDstrbtionModel')
const Attendance = require('../models/attendanceModel')
const visitors=require("../models/visitorModel")
const Appointments=require("../models/appointmentModel")




const securePassword =async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10); 
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = {

securePassword,





// ===============================< Login >================================//

loadLogin:(req, res) => {
  res.render("doctor/login", { error: null, message: null });  
},


DoctorLogin: async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.render("doctor/login", {
        message: null,
        error: "User not found.",
      });

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch)
      return res.render("doctor/login", {
        error: "Wrong password.",
        message: null,
      });
    if (user.is_doctor === 1 && user.is_varified === 1) { 
      req.session.doctor = user._id;
      return res.redirect("/doctor/dashboard")
    } else {
      return res.redirect("/doctor/login?error=" + encodeURIComponent("You are not a verified Doctor"));
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
},



    // ===============================< Logout >================================//

logoutDoctor:(req, res) => {
  req.session.destroy();
  res.redirect("/doctor/login");
},

// ===============================< Volunteer Management >======================//



dashboard : async (req, res) => {
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
    res.render("doctor/dashboard", { users, q });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},

loadEditUser : async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render("doctor/editUser", { user });
  } catch (error) {
    console.log(error);
  }
},

 updateUser : async (req, res) => {
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
    res.redirect("/doctor/dashboard");
  } catch (error) {
    console.log(error);
  }
},

 deleteUser : async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (req.session.user_session === user._id) {
      req.session.destroy();
    }
    return res.redirect("/doctor/dashboard");
  } catch (error) {
    console.log(error.message);
  }
},

DoctorAddUser : async (req, res) => {
  try {
    res.render("doctor/createUser", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
},


 createUser : async (req, res) => {
  const { name, email, password, mobile, is_varified } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  try {
    if (!email)
      return res.render("doctor/createUser", { error: "Email is required" });
    if (!emailRegex.test(email))
      return res.render("doctor/user_new", {
        error: "Email must be a valid email!",
      });
      if(password<6){
        return res.render("doctor/createUser", {
          message: null,
          error: "password must be atleast 6 letters",
        });
      }
    const isExists = await User.findOne({ email });
    if (isExists)
      return res.render("doctor/createUser", {
        error: "User already exists",
        message: null,
      });
      const secPassword = await securePassword(req.body.password);
    const user = new User({
      name,
      email,
      mobile,
      password:secPassword,
      is_varified,
    });
    await user.save();
    return res.redirect("/doctor/dashboard");
  } catch (error) {
    console.log(error.message);
  }
},
    // ===============================< staff management>================================//



    ViewLabStaff : async (req, res) => {
      const { q } = req.query;
      try {
        let users;
        if (q && q.length > 0) {
          users = await User.find({
            name: { $regex: ".*" + q + ".*" },
            is_Admin: 0,
          });
        } else {
          users = await User.find({ is_Lab_Staff: 1 });
          console.log(users,"usss")
        }
        res.render("doctor/staffs", { users, q });
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
    
        res.render("admin/staffs", { users, message: null, error: null });
      } catch (error) {
        console.log(error.message);
      }
    },









// ===============================< Patient Management >================================//


 getAddPatient :async (req, res) => {
  try {
    const today = new Date();

    const medicines = await Medicine.find({
      expiry: { $gt: today }
    });
        res.render("doctor/addPatient", { error: null, message: null, medicines });
  } catch (error) {
    console.log(error.message);
  }
},

 getPatientsList: async (req, res) => {
  try {
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

    res.render("doctor/patients", {
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
      patients = await Patient.aggregate([
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
      patients = await Patient.aggregate([
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

    res.render("doctor/patients", { patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
},


 AddPatient : async (req, res) => {
  let { name, mobile, disease,is_Active, DoctorName, selectedMedicines } = req.body;
  try {
    function generateRandomID(length) {
      const charset = "0123456789";
      let randomID = "";
      const charsetLength = charset.length;

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        randomID += charset[randomIndex];
      }

      return randomID;
    }
    if(typeof selectedMedicines === "string"){
      let medicine = selectedMedicines
      selectedMedicines = []
      selectedMedicines.push(medicine)
    }
    const patient = new Patient({
      RegNo: generateRandomID(5),
      name,
      disease,
      is_Active,
      mobile,
      DoctorName,
      Medicines: selectedMedicines?selectedMedicines.map((medId) => ({
        medicine: medId,
      })):null,
      addingDate: Date.now(),
    });
     console.log(patient)
    await patient.save();
    return res.redirect("/doctor/patients");
  } catch (error) {
    console.log(error.message);
  }
},

 editPatient :async (req, res) => {
  const { id } = req.params;
  try {
    const Pid = await Patient.findById(id);
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

    const currentMedicines = patient[0].Medicines;

    if (patient.length === 0) {
      return res.status(404).send("Patient not found");
    }

    const medicines = await Medicine.find();
    res.render("doctor/editPatient", {
      currentMedicines,
      patient,
      medicines,
      error: null,
      message: null,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},

 updatePatient : async (req, res) => {
  let { id,name, disease, mobile, DoctorName, selectedMedicines } = req.body;
  try {
    if (!name)
      return res.render("doctor/createUser", { error: "Name is required" });
    if (name.length < 3) {
      return res.render("doctor/addPatient", {
        error: "name should contain atleast 3 letters",
      });
    }
    if (!disease)
      return res.render("doctor/createUser", {
        error: "Disease name is required",
      });
    if (!DoctorName)
      return res.render("doctor/createUser", {
        error: "doctors Name is required",
      });
      if(typeof selectedMedicines === "string"){
        let medicine = selectedMedicines
        selectedMedicines = []
        selectedMedicines.push(medicine)
      }
    await Patient.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          disease,
          mobile,
          DoctorName,
          Medicines: selectedMedicines?selectedMedicines.map((medId) => ({
            medicine: medId,
          })):null,
        },
      },
      { new: true }
    );
    res.redirect("/doctor/patients");
  } catch (error) {
    console.log(error.message);
  }
},

//  deletePatient : async (req, res) => {
//   const { id } = req.params;
//   try {
//     await Patient.findByIdAndDelete(id);
//     res.redirect("/doctor/patients");
//   } catch (error) {
//     console.log(error.message);
//   }
// },


patienttoggleVerification : async (req, res) => {
  const userId = req.params.id;
  const { is_Active } = req.body;

  try {
    const patient = await Patient.findById(userId);
    if (!patient) {
      return res.status(404).json({ message: 'patient not found' });
    }

    patient.is_Active = is_Active === '0' ? false : true;
    await patient.save();

    res.redirect('/doctor/patients'); 
  } catch (error) {
    console.error('Error toggling verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},


// ===============================<  medicine distribution history >================================//


 medicineHistory : async (req,res)=>{
  try {
    const medicineDistributions = await MedicineDistribution.find() .populate('patient')
    res.render('doctor/medicineHistory',{medicineDistributions})
  } catch (error) {
    console.log(error.message)    
  }
} , 



// ===============================< Attendance >================================//



 getAttendence : async (req,res) => {
  res.render("doctor/attendanceForm")
},
 
MarkAttendence : async (req,res) => {
  const { status , role } = req.body
  
  
  const sdate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dates = sdate.toLocaleDateString('en-US', options);
  const userId =  req.session.doctor 

  const existingAttendance = await Attendance.findOne({
    userId,
    date : dates
});
console.log(existingAttendance)
  if (existingAttendance) {
    return res.status(400).json({ error: "Attendance already marked for today" });
  }
  
  const attendence = new Attendance ({userId,status,date : dates,role})
  await attendence.save()

  res.redirect("/doctor/dashboard")
},



 renderAttendenceDisplay : async (req, res) => {

  const userId = req.session.doctor;
  const attendanceThisMonth = await User.findById(userId).populate({path :"attendanceHistory"})
     console.log(attendanceThisMonth)

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

      console.log('year attendanceeeeeee',YearlyAttendance)

      res.render('doctor/attendanceDisplay',{MOnthByAttendance,YearlyAttendance})
    },


// ===============================< Visitor >================================//



    // ViewVisitors: async (req, res) => {
    //   const { q } = req.query;
    //   try {
    //     let users;
    //     if (q && q.length > 0) {
    //       users = await visitors.find({
    //         name: { $regex: ".*" + q + ".*" },
    //         is_Approved:1
    //       });
    //     } else {
    //       users = await visitors.find({
    //         is_Approved:1
    //       });
    //     }
    //     res.render("doctor/visitors", { users, q });
    //   } catch (error) {
    //     console.log(error.message);
    //     res.status(500).send("Internal Server Error");
    //   }
    // },
  
    ViewVisitors : async (req, res) => {
      try {
          const page = req.query.page || 1; 
          const limit = 4; // Number of appointments per page
  
          // Calculate the skip value based on the page number and limit
          const skip = (page - 1) * limit;
  
          // Fetch approved appointments with pagination from the database
          const appointments = await Appointments.find({ is_Approved: 1 })
              .sort({ date: -1 })
              .skip(skip)
              .limit(limit);
  
          // Count total number of approved appointments
          const totalAppointments = await Appointments.countDocuments({ is_Approved: 1 });
  
          // Calculate total number of pages
          const totalPages = Math.ceil(totalAppointments / limit);
  
          // Render the view with approved appointments and pagination data
          res.render('doctor/latestAppointments', {
              appointments: appointments,
              totalAppointments: totalAppointments,
              currentPage: parseInt(page),
              totalPages: totalPages
          });
      } catch (error) {
          console.error('Error fetching latest appointments:', error);
          // Render an error page or return an error response
          res.status(500).send('An error occurred while fetching latest appointments');
      }
  },
  
 
  



};
