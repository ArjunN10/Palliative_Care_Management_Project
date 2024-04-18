// models/Appointment.js

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    gender: {
      type: String,
      enum:["male","female"],
      required: true
  },
    mobile: {
        type: String,
        required: true
    },
  
    message: {
        type: String,
        required: true
    },
    is_Approved:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
