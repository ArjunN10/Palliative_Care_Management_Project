const Patients=require("../models/patientModel")
const User=require("../models/userModel")
const Medicine=require("../models/medicineModel")
const bcrypt=require("bcrypt")




const securePassword =async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};




module.exports={

  securePassword,

// ===============================< Login >================================//

    loadLogin: async (req, res) => {
        try {
            res.render("admin/login", { error: null, message: null });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    },


    AdminLogin: async (req, res) => {
        const { email, password } = req.body;
        try {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                req.session.admin = true;
                return res.redirect("/admin/dashboard");
            } else {
                return res.redirect("/admin/login?error=Invalid email or password");
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    

    
    // ===============================< Admin Logout >================================//
    
    logoutAdmin:(req, res) => {
      req.session.destroy();
      res.redirect("/admin/login");
    },

    
    // ===============================< Volunteer Management >================================//
    
          AdminDashboard : async (req, res) => {
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
              console.log(users,"uu")
              res.render("admin/dashboard", { users, q });
            } catch (error) {
              console.log(error.message);
              res.status(500).send("Internal Server Error");
            }
          },
    

  AdminAddedVolunteer : async (req, res) => {
    try {
      res.render("admin/createVolunteers", { error: null, message: null });
    } catch (error) {
      console.log(error.message);
    }
  },


createVolunteer : async (req, res) => {
  const { name, email, password, mobile,  } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  try {
    if (!email)
      return res.render("admin/createVolunteers", { error: "Email is required" });
    if (!emailRegex.test(email))
      return res.render("admin/user_new", {
        error: "Email must be a valid email!",
      });
      if(password<6){
        return res.render("admin/createVolunteers", {
          message: null,
          error: "password must be atleast 6 letters",
        });
      }
    const isExists = await User.findOne({ email });
    if (isExists)
      return res.render("admin/createVolunteers", {
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
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
},
    
      loadEditVolunteer : async (req, res) => {
        const { id } = req.params;
        try {
          const user = await User.findById(id);
          res.render("admin/editVolunteers", { user });
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
          res.redirect("/admin/dashboard");
        } catch (error) {
          console.log(error);
        }
      },

      deleteVolunteer: async (req, res) => {
        const { id } = req.params;
        try {
          const user = await User.findOneAndDelete({ _id: id });
          if (req.session.user_session === user._id) {
            req.session.destroy();
          }
          return res.redirect("/admin/dashboard");
        } catch (error) {
          console.log(error.message);
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
    console.log(users,"kkk")
    res.render("admin/doctors", { users, q });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
},



loadEditDoctor : async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render("admin/editDoctor", { user });
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
    res.redirect("/admin/doctors");
  } catch (error) {
    console.log(error);
  }
},


 deleteDoctor : async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (req.session.doctor_session === user._id) {
      req.session.destroy();
    }
    return res.redirect("/admin/doctors");
  } catch (error) {
    console.log(error.message);
  }
},

AdminAddedDoctor : async (req, res) => {
  try {
    res.render("admin/createDoctor", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
},





createDoctor : async (req, res) => {
  const { name, email, password, mobile,  } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  try {
    if (!email)
      return res.render("admin/createDoctor", { error: "Email is required" });
    if (!emailRegex.test(email))
      return res.render("admin/user_new", {
        error: "Email must be a valid email!",
      });
      if(password<6){
        return res.render("admin/createDoctor", {
          message: null,
          error: "password must be atleast 6 letters",
        });
      }
    const isExists = await User.findOne({ email });
    if (isExists)
      return res.render("admin/createDoctor", {
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
    return res.redirect("/admin/doctors");
  } catch (error) {
    console.log(error.message);
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

    res.render("admin/patients", {
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

    res.render("admin/patients", { patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
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
    res.render("admin/staffs", { users, q });
  } catch (error) {
    console.log(error.message);
  }
},

loadEditStaff : async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render("admin/editStaff", { user });
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
    res.redirect("/admin/staffs");
  } catch (error) {
    console.log(error);
  }
},


 deleteStaff : async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (req.session.LaboratoryStaff_session === user._id) {
      req.session.destroy();
    }
    return res.redirect("/admin/staffs");
  } catch (error) {
    console.log(error.message);
  }
},

AdminAddedStaff : async (req, res) => {
  try {
    res.render("admin/createStaff", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
},



 createStaff : async (req, res) => {
  const { name, email, password, mobile,  } = req.body;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  try {
    if (!email)
      return res.render("admin/createStaff", { error: "Email is required" });
    if (!emailRegex.test(email))
      return res.render("admin/user_new", {
        error: "Email must be a valid email!",
      });
      if(password<6){
        return res.render("admin/createStaff", {
          message: null,
          error: "password must be atleast 6 letters",
        });
      }
    const isExists = await User.findOne({ email });
    if (isExists)
      return res.render("admin/createStaff", {
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
    return res.redirect("/admin/staffs");
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



// ===============================< medicine Management >================================//


getMedicines : async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const medicines = await Medicine.find();
    res.render("admin/medicines", {
      user,
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
      medicines = await Medicine.find({ name: { $regex: ".*" + q + ".*" } });
    } else {
      medicines = await Medicine.find();
    }
    res.render("admin/medicines", {
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
  const Pid = await Patients.findById(id);
  try {
    const patient = await Patients.aggregate([
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
    console.log(recievedMedicines);

    res.render("admin/patientMedicine", {
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
    const patient = await Patients.findById(patientId);

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
    res.redirect(`/patientMedicines/${patientId}`);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
},

distributioHistory : async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const medicineDistributions = await MedicineDistribution.find().populate(
      "patient"
    );
    res.render("admin/medicineHistory", { medicineDistributions, user });
  } catch (error) {
    console.log(error.message);
  }
},



}