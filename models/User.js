const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['student', 'teacher', 'admin'], required: true },

  // Optional: Track completed courses
  completedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
}, {
  timestamps: true
});

// ✅ Prevent OverwriteModelError
const User = mongoose.models?.User || mongoose.model('User', userSchema);

module.exports = User;
