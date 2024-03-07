const Patients=require("../models/patientModel")
const User=require("../models/userModel")
const Medicines=require("../models/medicineModel")
const bcrypt=require("bcrypt")

module.exports={


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
    

}