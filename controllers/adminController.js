const Patients=require("../models/patientModel")
const Users=require("../models/userModel")
const Medicines=require("../models/medicineModel")
const bcrypt=require("bcrypt")

module.exports={

    loadLogin: async (req, res) => {
        try {
            res.render("admin/login", { error: null, message: null });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    AdminLogin: async (req, res) => {
        const { email, password } = req.body
      
        try {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                req.session.admin = true;
                return res.render("admin/dashboard", { message: "Admin Logged in", error: null, q: req.query.q  });
            } else {
                return res.render("admin/login", { message: null, error: "Invalid email or password" });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    // AdminDashboard: async (req, res) => {
    //     try {
    //         // Check if the admin session variable is set
    //         if (req.session.admin) {
    //             // Render admin dashboard view
    //             return res.render("admin/dashboard");
    //         } else {
    //             // If not logged in, redirect to admin login page
    //             return res.redirect("/admin/login");
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //         res.status(500).send("Internal Server Error");
    //     }
    // }


    AdminDashboard: async (req, res) => {
        try {
          // Fetch the list of users from the database
          const users = await Users.find();
          console.log(users, "Users fetched");
      
          // Retrieve the value of the 'q' query parameter from the request
          const q = req.query.q;
      
          // Render the admin dashboard template and pass the users array and the 'q' variable to it
          res.render("admin/dashboard", { users: users, q: q });
        } catch (error) {
          console.log(error.message);
          res.status(500).send("Internal Server Error");
        }
      },
      
    

}