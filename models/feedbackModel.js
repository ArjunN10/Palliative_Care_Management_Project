

const mongoose=require("mongoose")


const feedbackSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true  
    }
})

module.exports=mongoose.model('Feedback',feedbackSchema)