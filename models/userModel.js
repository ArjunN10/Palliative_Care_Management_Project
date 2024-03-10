const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    is_Admin: {
        type: Number,
        default: 0
    },
    is_Lab_Staff:{
        type:Number,
        default : 0
    },
    
    is_varified: {
        type: Number,
        default: 0
    } ,

    attendanceHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendence', // Reference to the Attendance model
      }],

});



module.exports = mongoose.model('User', userSchema)