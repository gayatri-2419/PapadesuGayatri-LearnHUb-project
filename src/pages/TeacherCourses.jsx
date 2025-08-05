import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your courses.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/courses/my-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>My Courses</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>My Courses</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && courses.length === 0 ? (
        <p>No courses created yet.</p>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div className="col-md-4 mb-3" key={course._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{course.title ?? "Untitled"}</h5>
                  <p className="card-text">{course.description ?? "No description"}</p>
                  <p className="card-text"><strong>Category:</strong> {course.category ?? "N/A"}</p>
                  <p className="card-text text-muted">
                    Enrolled Students: {course.enrolledStudents?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
