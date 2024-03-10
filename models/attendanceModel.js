const mongoose = require('mongoose')


const attendanceSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userModel', // Reference to the Employee model
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'HalfDay'],
      required: true
    },
  });

  attendanceSchema.pre('save', async function(next) {
    // Update the user's attendanceHistory when a new attendance record is saved
    await mongoose.model('User').updateOne(
      { _id: this.userId },
      { $push: { attendanceHistory: this._id } }
    );
    next();
  });



module.exports = mongoose.model("Attendence" , attendanceSchema)