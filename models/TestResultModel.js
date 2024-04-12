const mongoose = require("mongoose");

const testingSchema = new mongoose.Schema ({

  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the Patient model
        required: true,
      },
        patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient", // Reference to the Patient model
        required: true,
      },

    name : {
        type : String ,
        required : true
    },

    disease: {
        type: String,
        required: true,
      } ,


    test_result : {
       type : String ,
       require : true
    }
}) ;
testingSchema.pre('save', async function(next) {
    // Update the user's attendanceHistory when a new attendance record is saved
    await mongoose.model('Patient').updateOne(
      { _id: this.patient },
      { $push: { test_result: this._id } }
    );
    next();
  });

module.exports = mongoose.model("test" ,testingSchema)

