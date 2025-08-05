import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Enrolled successfully!");
      fetchCourses(); // Refresh courses to update enrollment info
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Enrollment failed."
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Available Courses</h2>
      <div className="row">
        {courses.map((course) => {
          const isEnrolled = course.enrolledStudents.some(
            (student) => student._id === user._id
          );

          return (
            <div className="col-md-4" key={course._id}>
              <Card className="mb-4 shadow">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    Category: {course.category}
                  </Card.Subtitle>
                  <p>Enrolled Students: {course.enrolledStudents.length}</p>
                  {user?.type === "student" && (
                    <Button
                      onClick={() => handleEnroll(course._id)}
                      variant="success"
                      disabled={isEnrolled}
                    >
                      {isEnrolled ? "Enrolled" : "Enroll"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
