const User = require('../models/volunteerModel')
const bcrypt = require ('bcrypt')
const Medicine = require("../models/medicineModel");
const Patient = require("../models/patientModel");
const Attendence = require("../models/attendanceModel")
const Test = require("../models/TestResultModel")
const LPatient = require('../models/LabPatientModel')



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
        return res.redirect("/staff/login?error=" + encodeURIComponent("You are not an Laboratory Staff"));
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
  let {name, mobile, disease, DoctorName} = req.body
  
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

    const patient = await LPatient.create({
      RegNo : generateRandomID(5) ,
      name,
      disease,
      mobile,
      DoctorName,
      addingDate : Date.now()
      
    });


    
    return res.redirect("/staff/dashboard");

}; 

const editPatient  = async (req, res) => {
  const { id } = req.params;
  
    const Pid = await LPatient.findById(id);
    const patient = await LPatient

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
  
  
  const sdate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dates = sdate.toLocaleDateString('en-US', options);
  const userId =  req.session.LaboratoryStaff 

  const existingAttendance = await Attendence.findOne({
    userId,
    date : dates
});
console.log(existingAttendance)
  if (existingAttendance) {
    return res.status(400).json({ error: "Attendance already marked for today" });
  }

  
  const attendence = new Attendence ({userId,status,date:dates,role})
  await attendence.save()

  res.redirect("/staff/dashboard")
}
  




const renderAttendenceDisplay = async (req, res) => {

  const userId = req.session.LaboratoryStaff;
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


      res.render('staff/attendanceDisplay',{MOnthByAttendance,YearlyAttendance})
    }


const getTestResult = async (req,res) => {
  res.render("staff/testUpload")
}

const uploadImage = async (req,res) => {
  const { patientId, name, disease, test_result } = req.body;
  const userId = req.session.LaboratoryStaff;

  const patient = await Patient.findById(patientId)
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }
  const newTest = new Test({
    userId ,
    patient : patientId,
    name,
    disease,
    test_result,
  })
  await newTest.save()
  patient.test_result.push(newTest._id);
  await patient.save();
  res.render("staff/DisplaytestResult",{newTest})
  
}

const getAllResult = async (req,res) => {
  const UserId = req.session.LaboratoryStaff;

  const result = await Test.find()
  console.log(result)
  console.log(result)
  res.render("staff/TestResult",{result})
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
  getTestResult,
  getAllResult
  


}


