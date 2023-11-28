const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll_number: { type: String, required: true, unique: true },
  attendance: [
    {
      date: { type: Date, required: true,unique: true },
      isPresent: { type: Boolean, default: false },
    }
  ]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
