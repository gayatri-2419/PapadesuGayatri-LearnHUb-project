const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const PDFDocument = require("pdfkit");

// Get all courses (public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new course (Only teachers)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, content } = req.body;

    if (!req.user || req.user.type !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create courses" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      content,
      teacher: req.user._id,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created", course: newCourse });
  } catch (err) {
    console.error("Create course error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get courses for logged-in user
router.get("/my-courses", authMiddleware, async (req, res) => {
  try {
    if (req.user.type === "teacher") {
      const courses = await Course.find({ teacher: req.user._id }).populate("enrolledStudents", "name email");
      return res.json(courses);
    } else if (req.user.type === "student") {
      const courses = await Course.find({ enrolledStudents: req.user._id }).populate("teacher", "name email");
      return res.json(courses);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    console.error("Error fetching my courses:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Enroll in a course (Only students)
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.user.type !== "student") {
      return res.status(403).json({ message: "Only students can enroll" });
    }

    if (course.enrolledStudents.some(studentId => studentId.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.json({ message: "Enrollment successful", course });
  } catch (err) {
    console.error("Enrollment error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Complete course and generate certificate
router.post("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("teacher", "name");
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.user.type !== "student") {
      return res.status(403).json({ message: "Only students can complete courses" });
    }

    const user = await User.findById(req.user._id);
    if (!user.completedCourses) user.completedCourses = [];

    if (!user.completedCourses.includes(course._id)) {
      user.completedCourses.push(course._id);
      await user.save();
    }

    const doc = new PDFDocument({ size: "A4", margins: { top: 50, bottom: 50, left: 72, right: 72 } });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${course.title}_certificate.pdf`);
      res.send(pdfData);
    });

    // Certificate Layout
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .strokeColor("#0056b3")
      .stroke();

    doc.fontSize(30).fillColor("#003366").font("Times-Bold")
      .text("Certificate of Completion", { align: "center", underline: true });

    doc.moveDown(1);
    doc.lineWidth(1).strokeColor("#ccc").moveTo(100, doc.y).lineTo(doc.page.width - 100, doc.y).stroke();
    doc.moveDown(1);

    doc.font("Times-Italic").fontSize(22).fillColor("#000")
      .text("This certifies that", { align: "center" });

    doc.moveDown(0.5);
    doc.font("Helvetica-BoldOblique").fontSize(28).fillColor("#b30000")
      .text(user.name, { align: "center" });

    doc.moveDown(0.5);
    doc.font("Times-Roman").fontSize(18).fillColor("#000")
      .text("has successfully completed the course", { align: "center" });

    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(24).fillColor("#004d00")
      .text(course.title, { align: "center" });

    doc.moveDown(2);
    doc.font("Times-Roman").fontSize(16).fillColor("#000")
      .text(`Instructor: ${course.teacher.name}`, { align: "center" });

    doc.moveDown(1);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

    // Approved Stamp
    const stampRadius = 80;
    const centerX = doc.page.width / 2;
    const centerY = doc.y + stampRadius + 10;

    doc.circle(centerX, centerY, stampRadius)
      .lineWidth(3)
      .strokeColor("#2e8b57")
      .fillOpacity(0.2)
      .fillAndStroke("#dff0d8", "#2e8b57");

    const approvedText = "APPROVED";
    doc.font("Helvetica-Bold")
      .fontSize(26)
      .fillColor("#006400");

    const approvedWidth = doc.widthOfString(approvedText);
    const approvedX = centerX - approvedWidth / 2;
    const approvedY = centerY - 13;

    doc.text(approvedText, approvedX, approvedY);

    // Signature Section
    const sigX = 80;
    const sigY = doc.page.height - 120;
    const teacherName = course.teacher.name || "Instructor";

    doc.font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#000")
      .text(teacherName, sigX, sigY - 30);

    doc.moveTo(sigX, sigY)
      .lineTo(sigX + 200, sigY)
      .stroke();

    doc.font("Helvetica-Bold")
      .fontSize(13)
      .text("Signature", sigX + 60, sigY + 5);

    doc.end();

  } catch (err) {
    console.error("Completion error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
