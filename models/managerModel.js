
const mongoose = require('mongoose')

const managerSchema = new mongoose.Schema({
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
    is_manager: {    
        type: Number,
        default: 0
    },



});



module.exports = mongoose.model('Manager', managerSchema)






