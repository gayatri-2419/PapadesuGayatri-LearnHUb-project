// frontend/src/pages/ViewCourse.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [certificate, setCertificate] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/" + id);
        setCourse(res.data);
      } catch (err) {
        setMessage("Failed to load course.");
      }
    };
    fetchCourse();
  }, [id]);

  const handleComplete = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/courses/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setCertificate(res.data.certificate);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error completing course.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Course Content</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {course ? (
        <>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p><strong>Category:</strong> {course.category}</p>

          <hr />
          <h5>Course Material</h5>
          <p>This is a sample course content placeholder. Replace with real content if needed.</p>

          <button onClick={handleComplete} className="btn btn-success mt-3">
            Complete Course
          </button>

          {certificate && (
            <div className="mt-4 border rounded p-3 bg-light">
              <h5>🎓 Certificate of Completion</h5>
              <p><strong>Student:</strong> {certificate.student}</p>
              <p><strong>Course:</strong> {certificate.course}</p>
              <p><strong>Issued On:</strong> {certificate.issuedOn}</p>
            </div>
          )}
        </>
      ) : (
        <p>Loading course details...</p>
      )}
    </div>
  );
};

export default ViewCourse;
