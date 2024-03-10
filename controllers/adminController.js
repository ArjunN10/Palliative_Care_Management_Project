const Patients=require("../models/patientModel")
const User=require("../models/userModel")
const Medicines=require("../models/medicineModel")
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
    
                const users = await User.find({ is_varified: 1 });
                const q = req.query.q;
    
                return res.render("admin/dashboard", { users, q, message: "Admin Logged in", error: null });
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

    
    // ===============================< Dashboard >================================//
    
    
          AdminDashboard : async (req, res) => {
            const { q } = req.query;
            try {
              let users;
              if (q && q.length > 0) {
                users = await User.find({
                  name: { $regex: ".*" + q + ".*" },
                  is_varified: 1,
                });
              } else {
                users = await User.find({is_varified:1});
              }
              res.render("admin/dashboard", { users, q });
            } catch (error) {
              console.log(error.message);
            }
          },
    
    // ===============================< Volunteer Management >================================//


      createVolunteer : async (req, res) => {
        const { name, email, password, mobile, is_varified } = req.body;
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
            is_varified,
          });
          await user.save();
          return res.redirect("/admin/dashboard");
        } catch (error) {
          console.log(error.message);
        }
      },

      ViewVolunteer : async (req, res) => {
        try {
          res.render("admin/createVolunteers", { error: null, message: null });
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

CreateDoctor : async (req, res) => {
  const { name, email, password, mobile, is_Admin } = req.body;
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
      is_Admin,
    });
    await user.save();
    return res.redirect("/admin/doctors");
  } catch (error) {
    console.log(error.message);
  }
},


ViewDoctor : async (req, res) => {
  try {
    res.render("admin/createDoctor", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
},

EditDoctor : async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render("admin/editDoctor", { user });
  } catch (error) {
    console.log(error);
  }
},



searchDoctor : async (req, res) => {
  const { q } = req.body;
  try {
    let patients;

    if (q) {
      patients = await doctor.aggregate([
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

    res.render("doctor/patients", { patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
},


updateDoctor : async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, is_Admin } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          mobile,
          is_Admin,
        },
      },
      { new: true }
    );
    res.redirect("/admin/doctors");
  } catch (error) {
    console.log(error);
  }
},

deleteDoctor: async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (req.session.admin_session === user._id) {
      req.session.destroy();
    }
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
  const { name, email, mobile, is_Lab_Staff } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          mobile,
          is_Lab_Staff,
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
    if (req.session.user_session === user._id) {
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
  const { name, email, password, mobile, is_Lab_Staff } = req.body;
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
      is_Lab_Staff,
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







}