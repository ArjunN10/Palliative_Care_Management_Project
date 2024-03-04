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
        }
    },
    
    AdminLogin: async (req, res) => {
        const { email, password } = req.body;
        try {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                return res.render("admin/login", { message: "Admin Logged in", error: null });
            } else {
                return res.render("admin/login", { message: null, error: "Invalid email or password" });
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}