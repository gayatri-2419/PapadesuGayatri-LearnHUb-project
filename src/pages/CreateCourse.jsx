import React, { useState } from "react";
import axios from "axios";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You must be logged in.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/courses/create",
        { title, description, category, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Course created successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setContent("");
    } catch (error) {
      console.error("❌ Error:", error.response || error.message);
      if (error.response?.status === 403) {
        setMessage("❌ Only teachers can create courses.");
      } else if (error.response?.status === 401) {
        setMessage("❌ Unauthorized. Please log in again.");
      } else {
        setMessage("❌ Error creating course.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Course</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Course Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Course Content</label>
          <textarea
            className="form-control"
            placeholder="Add lessons, topics, videos, etc."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Create</button>
      </form>
    </div>
  );
};

export default CreateCourse;
