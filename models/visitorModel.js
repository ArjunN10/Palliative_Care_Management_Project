const mongoose = require('mongoose')
const visitorSchema = new mongoose.Schema({
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
    is_visitor: {    
        type: Number,
        default: 0
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment' // Reference to the Appointment model
    }],
    feedback: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }]

 
});



module.exports = mongoose.model('Visitor', visitorSchema)