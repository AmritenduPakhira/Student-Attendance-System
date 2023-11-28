const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }
  ]
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
