const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, type });

    res.status(201).json(user);
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  } catch (err) {
    console.error("Admin check error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (admin only)
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error("Delete user error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔥 Admin Route: Get Users with Courses (Teachers + Students)
router.get('/admin/user-courses', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const courses = await Course.find().populate('teacher', 'name email');

    const result = await Promise.all(
      users.map(async (user) => {
        let userCourses = [];

        if (user.type === 'teacher') {
          userCourses = courses.filter(course => course.teacher._id.equals(user._id));
        } else if (user.type === 'student') {
          userCourses = courses.filter(course =>
            course.enrolledStudents.includes(user._id)
          );
        }

        return {
          name: user.name,
          email: user.email,
          type: user.type,
          courses: userCourses.map(course => ({
            title: course.title,
            description: course.description
          }))
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Admin user-courses error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
