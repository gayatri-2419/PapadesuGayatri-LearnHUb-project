const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  content: { type: String }, // Full course content
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: true
});

// ✅ Prevent OverwriteModelError (use this in development/reloads)
const Course = mongoose.models?.Course || mongoose.model('Course', courseSchema);

module.exports = Course;
