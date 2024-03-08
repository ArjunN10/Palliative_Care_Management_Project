const User = require('../models/userModel')
const bcrypt = require ('bcrypt')
const Medicine = require("../models/medicineModel");
const Patient = require("../models/patientModel");



const loadLogin = (req, res) => {
    res.render("staff/login", { error: null, message: null });
  };

  const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };

const staffLogin = async (req,res)=>{

  const {email,password} = req.body
    try {
        const staff = await User.findOne({email})
        if(!staff)
            return res.render ('staff/login',{
               message: null ,
               error : 'staff not found'
            })
           
        const isMatch  = await bcrypt.compare(password,staff.password)
        if(!isMatch)
        return res.render('user/login',{
                message : null,
                error : 'wrong password'
        })

        if(staff.is_Lab_Staff === 1){
            req.session.LaboratoryStaff = staff._id
            res.redirect('/staff/dashboard')
        }else {
            res.render("/login?error=" + encodeURIComponent("You're nor laboratary staff"));
          }
          
        
        
    } catch (error) {
        console.log(error)
    }
     
};

const dashboard = async (req, res) => {
  const { q } = req.query;
  try {
    let users;
    if (q && q.length > 0) {
      users = await User.find({
        name: { $regex: ".*" + q + ".*" },
        is_Lab_Staff: 1,
      });
    } else {
      users = await User.find({ is_Lab_Staff: 1 });
    }
    res.render('staff/dashboard', { users, q });
  } catch (error) {
    console.log(error.message);
  }
};

const getAddPatient = async (req, res) => {
  try {
    const today = new Date();

    const medicines = await Medicine.find({
      expiry: { $gt: today }
    });
        res.render("staff/addPatient", { error: null, message: null, medicines });
  } catch (error) {
    console.log(error.message);
  }
};

const getPatientsList = async (req, res) => {
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

    res.render("staff/dashboard", {
      patients,
      error: null,
      message: null,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const searchPatient = async (req, res) => {
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

    res.render("staff/dashboard", { patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
};

const AddPatient = async (req,res) => {
  let {name, mobile, disease, DoctorName, selectedMedicines} = req.body
  console.log(req.body)
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
      RegNo : generateRandomID(5) ,
      name,
      disease,
      mobile,
      DoctorName,
      Medicine : selectedMedicines ? selectedMedicines.map(() => ({

      })):null ,
      addingDate : Date.now()
      
    });

    await patient.save();
    return res.redirect("/staff/dashboard");

    
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  loadLogin,
  staffLogin,
  dashboard ,
  getAddPatient,
  AddPatient,
  getPatientsList,
  searchPatient
}


