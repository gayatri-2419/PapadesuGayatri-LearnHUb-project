import React, { useEffect, useState } from "react";
import axios from "axios";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/courses/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch your courses.");
      }
    };

    fetchMyCourses();
  }, []);

  const handleCompleteCourse = async (courseId) => {
    setCompletingId(courseId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
      );

      // Create a blob URL for the PDF and download it
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Failed to complete the course or download certificate.");
    }
    setCompletingId(null);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-4">
      <h2>My Courses</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div className="col-md-6 mb-4" key={course._id}>
              <div className="card p-3">
                <h5>{course.title}</h5>
                <p><strong>Description:</strong> {course.description}</p>
                <p><strong>Category:</strong> {course.category}</p>
                <p><strong>Content:</strong></p>
                <p style={{ whiteSpace: "pre-wrap" }}>{course.content || "No content provided."}</p>

                {user?.type === "student" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleCompleteCourse(course._id)}
                    disabled={completingId === course._id}
                  >
                    {completingId === course._id ? "Completing..." : "Complete Course & Download Certificate"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
