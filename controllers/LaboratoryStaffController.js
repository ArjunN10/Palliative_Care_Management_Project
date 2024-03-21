const User = require('../models/userModel')
const bcrypt = require ('bcrypt')
const Medicine = require("../models/medicineModel");
const Patient = require("../models/patientModel");
const Attendence = require("../models/attendanceModel")
const Test = require("../models/TestResultModel")



const loadLogin = (req, res) => {
    res.render("staff/login", { error: null, message: null });
  };

  const staffLogin = async (req, res) => {

  
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.render("staff/login", {
          message: null,
          error: "staff not found.",
        });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.render("staff/login", {
          error: "Wrong password.",
          message: null,
        });

      if (user.is_Lab_Staff === 1 && user.is_varified === 1) { 
        req.session.LaboratoryStaff = user._id;
        return res.redirect("/staff/dashboard")
      } else {
        return res.redirect("/staff/login?error=" + encodeURIComponent("You are not a verified Doctor"));
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }



const getAddPatient = async (req, res) => {
  
    const today = new Date();
    const medicines = await Medicine.find({
      expiry: { $gt: today }
    });
      
    res.render("staff/addPatient", { error: null, message: null, medicines });
  
};

const getPatientsList = async (req, res) => {
  
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

    res.render("staff/dashboard", {
      patients,
      error: null,
      message: null,
    });
  
};

const searchPatient = async (req, res) => {
  const { q } = req.body;
  
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

    res.render("staff/dashboard", { patients, message: null, error: null });
  
};

const AddPatient = async (req,res) => {
  let {name, mobile, disease, DoctorName, selectedMedicines} = req.body
  
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

    const patient = await create.Patient({
      RegNo : generateRandomID(5) ,
      name,
      disease,
      mobile,
      DoctorName,
      Medicine : selectedMedicines ? selectedMedicines.map((medId) => ({
       medicine : medId
      })):null ,
      addingDate : Date.now()
      
    });
    console.log(patient)


    
    return res.redirect("/staff/dashboard");

}; 

const editPatient  = async (req, res) => {
  const { id } = req.params;
  
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
          as: "Medicines.medicine", // Store the medicine details in an array
        },
      },
    ]);

    const currentMedicines = patient[0].Medicines;

    if (patient.length === 0) {
      return res.status(404).send("Patient not found");
    }

    const medicines = await Medicine.find();
    res.render("staff/editPatient", {
      currentMedicines,
      patient,
      medicines,
      error: null,
      message: null,
    });
 
};

const updatePatient = async (req,res) => {
  
  let { id,name, disease, mobile, DoctorName, selectedMedicines } = req.body;
     if(name.length < 3) {
      return res.render ("staff/addPatient", {
        error : "name should contain atleast 3 letters" ,
      })
    }

     if(typeof selectedMedicines === "string"){
      let medicine = selectedMedicines
      selectedMedicines = [] 
      selectedMedicines.push(medicine)
    }

    await Patient.findByIdAndUpdate (
      id ,
      {
        $set : {
          name, 
          disease,
          mobile,
          DoctorName,
          Medicines: selectedMedicines?selectedMedicines.map((medId) => ({
            medicine: medId,
          })):null,
        },
      },
      {new : true}
     );
     res.redirect("/staff/dashboard")
  };

const deletePatient = async (req,res) => {
  const {id} = req.params 
    await Patient.findByIdAndDelete(id)
    res.redirect("/staff/dashboard")
  };


const getAttendence = async (req,res) => {

  res.render("staff/attendanceForm")
}

const MarkAttendence = async (req,res) => {
  const { status , role } = req.body
  console.log(role)
  console.log(status)
  const date = new Date();
  console.log(date)
  const userId =  req.session.LaboratoryStaff 

  const existingAttendance = await Attendence.findOne({
    userId,
    date: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()), // Start of the day
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) // End of the day
    }
});
console.log(existingAttendance)
  if (existingAttendance) {
    return res.status(400).json({ error: "Attendance already marked for today" });
  }

 else{
  
  const attendence = new Attendence ({userId,status,date ,role})
  await attendence.save()

  res.redirect("/staff/dashboard")
}
  
 } 



const renderAttendenceDisplay = async (req, res) => {
  const userId = req.session.LaboratoryStaff;
  
  
  const currentDate = new Date();

  // Calculate the start and end dates for the week
  const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()); // Start of the current week (Sunday)
  const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), startOfWeek.getDate() + 6); // End of the current week (Saturday)

  // Calculate the start and end dates for the month
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of the current month

 
      // attendanceHistory within the current week
      const attendanceThisWeek = await User.findById(userId).populate({
          path: 'attendanceHistory',
          match: {
              date: { $gte: startOfWeek, $lte: endOfWeek }
          }
      });

      // attendanceHistory within the current month
      const attendanceThisMonth = await User.findById(userId).populate({
          path: 'attendanceHistory',
          match: {
              date: { $gte: startOfMonth, $lte: endOfMonth }
          }
      });

      res.render("staff/attendanceDisplay", {
          attendanceThisWeek,
          attendanceThisMonth
      });
  
}


const getTestResult = async (req,res) => {
  res.render("staff/testUpload")
}

const uploadImage = async (req,res) => {
  const { patientId, name, disease, test_result } = req.body;
  console.log(req.body.test_result)
  const patient = await Patient.findById(patientId)
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }
  const newTest = new Test({
    patient: patientId,
    name,
    disease,
    test_result,
  });
  console.log(newTest)
  await newTest.save()
  patient.test_result.push(newTest._id);
  await patient.save();
  res.render("staff/DisplaytestResult",{newTest})
  
}









module.exports = {
  loadLogin,
  staffLogin,
  getAddPatient,
  AddPatient,
  getPatientsList,
  searchPatient,
  editPatient,
  updatePatient,
  deletePatient,
  getAttendence,
  MarkAttendence,
  renderAttendenceDisplay,
  uploadImage,
  getTestResult

}


