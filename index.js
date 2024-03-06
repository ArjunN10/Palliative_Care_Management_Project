require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const userRoute = require('./routes/userRoute')
const doctorRoute=require('./routes/doctorRoute')
const adminRoute=require('./routes/adminRoute')
const nocache = require('nocache')
const flash = require('express-flash')
const path = require('path')
const methodOverride = require('method-override')

mongoose.connect('mongodb+srv://arjunrameshh12:rA7sBc8wywxspAeV@cluster3.xyqbca7.mongodb.net/Paliative_Care_Management').then(() => console.log('DB Connected')).catch(err => console.log(err))

const app = express()

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


app.use('/', userRoute)
app.use('/doctor',doctorRoute )
app.use('/admin',adminRoute)

app.listen(4000, () => {
    console.log("Server Started!");
})