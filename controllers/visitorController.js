
const visitors=require("../models/visitorModel")
const bcrypt = require("bcrypt");
const Appointment=require('../models/appointmentModel')


module.exports={


// ===============================< Register >================================//
loadRegister :async (req, res) => {
    try {
      res.render("visitor/registration", { error: null, message: null });
    } catch (error) {
      console.log(error.message);
    }
  },

VisitorRegister: async (req, res) => {
    const { name, email, password, mobile } = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    try {
      if (!email)
        return res.render("visitor/registration", { error: "Email is required" });
      if (!emailRegex.test(email))
        return res.render("visitor/registration", {
          error: "Email must be a valid email address!",
        });
  
      if (password.length < 6) {
        return res.render("visitor/registration", {
          error: "Password must be at least 6 characters long",
        });
      }
      const isExists = await visitors.findOne({ email });
      if (isExists)
        return res.render("visitor/registration", {
          error: "User with this email already exists",
        });
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new visitors({
        name,
        email,
        mobile,
        password: hashedPassword, 
        is_visitor: 1,
      });
      await user.save();
      return res.redirect("/visitor/index");
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Internal Server Error");
    }
  },


// ===============================< Login >================================//



loadLogin:(req, res) => {
    res.render("visitor/login", { error: null, message: null });  
  },
  
  
  VisitorLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await visitors.findOne({ email });
      if (!user)
        return res.render("visitor/login", {
          message: null,
          error: "User not found.",
        });
  
      const isMatch = await bcrypt.compare(password, user.password); 
      if (!isMatch)
        return res.render("visitor/login", {
          error: "Wrong password.",
          message: null,
        });
      if (user.is_visitor === 1 ) { 
        req.session.visitor = user._id;
        return res.redirect("/visitor/index")
      } else {
        return res.redirect("/visitor/login?error=" + encodeURIComponent("Your Account not found"));
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Internal Server Error");
    }
  },


   visitorDashboard : async (req, res) => {  
    try {
      console.log("ooofirst")
        res.render('visitor/index', { user: req.user }); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
},

// ===============================< Appointment >================================//

VisitorAppointment:async (req, res) => {
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'parirakshacontroller@gmail.com',
        pass: 'ParirakshaControlller2007', 
      },
    });


    const newAppointment = new Appointment({
      name: req.body.name,
      email: req.body.email,
      date: req.body.date,
      phone: req.body.phone,
      message: req.body.message,
    });

    await newAppointment.save();

    await transporter.sendMail({
      from: req.body.email, 
      to: 'parirakshacontroller@gmail.com', //recepient email here
      subject: 'New Appointment Request',
      text: `You have a new appointment request from ${newAppointment.name} (${newAppointment.email}) on ${newAppointment.date}.`,
    });

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'An error occurred while booking appointment' });
  }

},

feedbackData:async(req,res)=>{
  try {
    const {feedbackData} = req.body;
    
  } catch (error) {
    
  }
}


}