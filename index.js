require("dotenv").config();
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const path = require('path')
const cors=require("cors")

const volunteerRoute = require('./routes/volunteerRoute')
const doctorRoute=require('./routes/doctorRoute')
const adminRoute=require('./routes/adminRoute')
const staffRoute=require('./routes/staffRoute')
const visitorRoute=require('./routes/visitorRoute')
const managerRoute=require('./routes/managerRoute')


const nocache = require('nocache')
const flash = require('express-flash')
const methodOverride = require('method-override')
  

mongoose.connect('mongodb+srv://arjunrameshh12:rA7sBc8wywxspAeV@cluster3.xyqbca7.mongodb.net/Paliative_Care_Management')
.then(() => console.log('DB Connected'))
.catch(err => console.log(err))

app.use(cors());
app.use(express.json());

app.set('view engine','ejs')

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: "dghsagdhgasdfasgfsaf",
    resave: false,
    saveUninitialized: true
}))

app.use(nocache())  



app.use(methodOverride('_method'))
app.use(flash())

app.use('/manager',managerRoute)        //manager
app.use('/volunteer', volunteerRoute)   //volunteer 
app.use('/staff',staffRoute )           //staff
app.use('/doctor',doctorRoute )         //doctor
app.use('/admin',adminRoute)            //admin
app.use('/',visitorRoute)               //visitor  


app.listen(4000, () => {
    console.log("Server Started!"); 
})